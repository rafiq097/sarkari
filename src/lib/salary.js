/**
 * Salary estimator. Builds an indicative gross and in-hand monthly figure from a
 * starting basic pay and the pay rule set in src/data/pay-rules/pay-rules.json.
 * Used by the exam profile salary tab, the salary explorer and the comparison table.
 */
import { payRules } from './data.js'

/** Returns the rule set object for a key, or null when it is not modelled. */
export function getRuleSet(ruleSetKey) {
  return payRules.ruleSets[ruleSetKey] ?? null
}

/** Finds the transport allowance row for a central pay level ("10", "13A"). */
function findTransportRow(ruleSet, payLevel) {
  const levelNumber = Number.parseInt(String(payLevel ?? '').replace(/[^0-9]/g, ''), 10)
  if (!ruleSet.transportAllowance?.length || Number.isNaN(levelNumber)) return null
  if (levelNumber >= 9) return ruleSet.transportAllowance[0]
  if (levelNumber >= 3) return ruleSet.transportAllowance[1]
  return ruleSet.transportAllowance[2]
}

/** Computes HRA for a slab, honouring minimum and maximum amounts. */
function computeHra(basicPay, hraSlab, customHraPercent) {
  if (customHraPercent != null) return (basicPay * customHraPercent) / 100
  if (!hraSlab) return 0
  let amount = (basicPay * hraSlab.percent) / 100
  if (hraSlab.minimum) amount = Math.max(amount, hraSlab.minimum)
  if (hraSlab.maximum) amount = Math.min(amount, hraSlab.maximum)
  return amount
}

/**
 * Estimates monthly pay.
 * options: { ruleSetKey, basicPay, payLevel, hraSlabIndex, customHraPercent, higherTransportCity }
 * Returns null when the rule set has no DA model (for example bank pay).
 */
export function estimateSalary({ ruleSetKey, basicPay, payLevel, hraSlabIndex = 0, customHraPercent = null, higherTransportCity = true }) {
  const ruleSet = getRuleSet(ruleSetKey)
  if (!ruleSet || ruleSet.daPercent == null || !basicPay) return null

  const dearnessAllowance = (basicPay * ruleSet.daPercent) / 100
  const houseRentAllowance = computeHra(basicPay, ruleSet.hra?.[hraSlabIndex], customHraPercent)
  const transportRow = findTransportRow(ruleSet, payLevel)
  const transportBase = transportRow ? (higherTransportCity ? transportRow.higherCities : transportRow.otherPlaces) : 0
  // DA is paid on Transport Allowance at the same rate as on pay (central rules).
  const transportAllowance = transportBase * (1 + ruleSet.daPercent / 100)

  const gross = basicPay + dearnessAllowance + houseRentAllowance + transportAllowance
  const pensionContribution = ((basicPay + dearnessAllowance) * (ruleSet.pensionDeductionPercent ?? 0)) / 100
  // Professional tax is Rs 200 per month in all three states at these salary levels.
  const professionalTax = gross > 25000 ? 200 : 0
  const inHand = gross - pensionContribution - professionalTax

  return {
    ruleSet,
    lines: [
      { label: 'Basic pay', amount: basicPay },
      { label: `Dearness Allowance (${ruleSet.daPercent}%)`, amount: dearnessAllowance },
      { label: customHraPercent != null ? `HRA (${customHraPercent}%, entered)` : `HRA (${ruleSet.hra?.[hraSlabIndex]?.label ?? 'not modelled'})`, amount: houseRentAllowance },
      { label: 'Transport Allowance incl. DA', amount: transportAllowance },
    ],
    deductions: [
      { label: `Pension contribution (${ruleSet.pensionDeductionPercent}% of basic + DA)`, amount: pensionContribution },
      { label: 'Professional tax', amount: professionalTax },
    ],
    gross,
    inHand,
  }
}

/** Builds central pay matrix cells for a level: each cell is 3% above the previous, rounded to the nearest 100 (matches the published matrix). */
export function centralMatrixCells(level, count = 40) {
  const ruleSet = getRuleSet('central-7cpc')
  const firstCell = ruleSet.matrixFirstCells[level]
  const lastCell = ruleSet.matrixLastCells[level]
  if (!firstCell) return []
  const cells = [firstCell]
  while (cells.length < count && cells[cells.length - 1] < lastCell) {
    const next = Math.round((cells[cells.length - 1] * 1.03) / 100) * 100
    cells.push(Math.min(next, lastCell))
  }
  return cells
}
