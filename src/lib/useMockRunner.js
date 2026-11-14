/**
 * State of a running mock test: current section and question, chosen answers, questions
 * marked for review, visited questions, seconds spent per question and the countdown.
 * Enforces the section rule of the plan (lib/mock.js): with locked sections each section
 * has its own timer and cannot be reopened; otherwise one timer covers the whole test.
 * Used by components/mock/MockRunner.jsx.
 */
import { useEffect, useReducer } from 'react'

const tickMilliseconds = 1000

/** Starting state for a plan. */
function initialState(plan) {
  const firstQuestion = plan.sections[0].questions[0]
  return {
    sectionIndex: 0,
    questionIndex: 0,
    answers: {},
    marked: {},
    visited: { [firstQuestion.id]: true },
    secondsByQuestion: {},
    // Countdown for the current section (locked) or the whole test; null when untimed.
    remainingSeconds: plan.isLocked ? plan.sections[0].seconds : plan.totalSeconds,
    isFinished: false,
  }
}

/** Moves to a question and records it as visited. */
function openQuestion(state, plan, sectionIndex, questionIndex) {
  const question = plan.sections[sectionIndex].questions[questionIndex]
  return { ...state, sectionIndex, questionIndex, visited: { ...state.visited, [question.id]: true } }
}

/** Ends the current section: opens the next one with its own timer, or finishes the test. */
function closeSection(state, plan) {
  const nextIndex = state.sectionIndex + 1
  if (!plan.isLocked || nextIndex >= plan.sections.length) return { ...state, isFinished: true }
  return { ...openQuestion(state, plan, nextIndex, 0), remainingSeconds: plan.sections[nextIndex].seconds }
}

/** One second passed: charge it to the open question and run the countdown. */
function tick(state, plan) {
  const questionId = plan.sections[state.sectionIndex].questions[state.questionIndex].id
  const withTime = { ...state, secondsByQuestion: { ...state.secondsByQuestion, [questionId]: (state.secondsByQuestion[questionId] ?? 0) + 1 } }
  if (state.remainingSeconds == null) return withTime
  const remainingSeconds = state.remainingSeconds - 1
  return remainingSeconds > 0 ? { ...withTime, remainingSeconds } : closeSection({ ...withTime, remainingSeconds: 0 }, plan)
}

/** Reducer; every action carries the plan so the rules stay in one place. */
function reducer(state, action) {
  if (state.isFinished) return state
  const { plan } = action
  const questionId = plan.sections[state.sectionIndex].questions[state.questionIndex].id
  switch (action.type) {
    case 'tick':
      return tick(state, plan)
    case 'open':
      // Locked sections cannot be left through the palette or the section tabs.
      if (plan.isLocked && action.sectionIndex !== state.sectionIndex) return state
      return openQuestion(state, plan, action.sectionIndex, action.questionIndex)
    case 'answer':
      return { ...state, answers: { ...state.answers, [questionId]: action.optionIndex } }
    case 'clear':
      return { ...state, answers: { ...state.answers, [questionId]: null } }
    case 'toggleMark':
      return { ...state, marked: { ...state.marked, [questionId]: !state.marked[questionId] } }
    case 'closeSection':
      return closeSection(state, plan)
    case 'finish':
      return { ...state, isFinished: true }
    default:
      return state
  }
}

/**
 * Runs a mock test. Returns the state plus action functions:
 * open(sectionIndex, questionIndex), answer(optionIndex), clear(), toggleMark(),
 * closeSection() (locked mode: submit this section) and finish() (submit the test).
 */
export function useMockRunner(plan) {
  const [state, dispatch] = useReducer(reducer, plan, initialState)

  useEffect(() => {
    if (state.isFinished) return undefined
    const timer = window.setInterval(() => dispatch({ type: 'tick', plan }), tickMilliseconds)
    return () => window.clearInterval(timer)
  }, [plan, state.isFinished])

  return {
    state,
    open: (sectionIndex, questionIndex) => dispatch({ type: 'open', plan, sectionIndex, questionIndex }),
    answer: (optionIndex) => dispatch({ type: 'answer', plan, optionIndex }),
    clear: () => dispatch({ type: 'clear', plan }),
    toggleMark: () => dispatch({ type: 'toggleMark', plan }),
    closeSection: () => dispatch({ type: 'closeSection', plan }),
    finish: () => dispatch({ type: 'finish', plan }),
  }
}
