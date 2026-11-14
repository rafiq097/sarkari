/**
 * Mock test page for one exam (/exams/<examId>/mock, with ?variant= for a stream).
 * Loads the profile and its question sets, builds the test plan from the profile's
 * pattern block, then moves through three screens: start, running test, result.
 * Finished attempts are saved in this browser. Only exams with a pattern block and a
 * folder in src/data/mocks/ have a mock test.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Breadcrumbs, EmptyState, PageHeader } from '../components/Common.jsx'
import { MockIntro } from '../components/mock/MockIntro.jsx'
import { MockRunner } from '../components/mock/MockRunner.jsx'
import { MockResult } from '../components/mock/MockResult.jsx'
import { useProfile } from '../lib/data.js'
import { applyVariant } from '../lib/variants.js'
import { buildTestPlan, scoreAttempt } from '../lib/mock.js'
import { attemptsFor, hasMockSets, loadMockQuestions, saveAttempt } from '../lib/mockData.js'

/** Loads the question set of an exam and stream. Returns { questions, isSample } or null while loading. */
function useMockQuestions(examId, variantId) {
  const requestKey = `${examId}~${variantId ?? ''}`
  const [loaded, setLoaded] = useState({ key: null, value: null })
  useEffect(() => {
    let isCurrent = true
    loadMockQuestions(examId, variantId).then((value) => {
      if (isCurrent) setLoaded({ key: requestKey, value })
    })
    return () => {
      isCurrent = false
    }
  }, [examId, variantId, requestKey])
  return loaded.key === requestKey ? loaded.value : null
}

/** Shown when an exam has no mock test (no pattern or no question set). */
function NoMockTest({ examId }) {
  return (
    <EmptyState
      title="No mock test for this exam"
      action={
        <Link to={`/exams/${examId}`} className="button">
          Back to the exam page
        </Link>
      }
    >
      Mock tests exist only for selected exams that have a recorded paper pattern.
    </EmptyState>
  )
}

/** Mock test page. */
export default function MockTestPage() {
  const { examId } = useParams()
  const [searchParams] = useSearchParams()
  const { profile, isLoading, notFound } = useProfile(examId)
  const exam = profile ? applyVariant(profile, searchParams.get('variant')) : null
  const variantId = exam?.activeVariant?.id ?? null
  const mockQuestions = useMockQuestions(examId, variantId)
  // screen is 'intro', 'running' or 'result'; finished holds the submitted answers and times.
  const [screen, setScreen] = useState('intro')
  const [finished, setFinished] = useState(null)

  const pattern = exam?.pattern ?? null
  const plan = useMemo(() => (pattern && mockQuestions ? buildTestPlan(pattern, mockQuestions.questions) : null), [pattern, mockQuestions])

  const handleFinish = useCallback(
    ({ answers, secondsByQuestion }) => {
      const result = scoreAttempt(plan, answers, secondsByQuestion)
      saveAttempt({ examId, variantId, finishedAt: new Date().toISOString(), isSample: mockQuestions.isSample, score: result.score, maximumScore: result.maximumScore, correctCount: result.correctCount, wrongCount: result.wrongCount, skippedCount: result.skippedCount, seconds: result.seconds })
      setFinished({ answers, secondsByQuestion, result })
      setScreen('result')
      window.scrollTo({ top: 0, behavior: 'instant' })
    },
    [plan, examId, variantId, mockQuestions],
  )

  if (isLoading || (!notFound && hasMockSets(examId) && !mockQuestions)) return <div className="page-fallback" aria-busy="true" />
  if (notFound || !plan || plan.questionCount === 0) return <NoMockTest examId={examId} />

  const examLabel = `${exam.abbreviation || exam.name}${exam.activeVariant ? ` (${exam.activeVariant.name})` : ''}`
  const examLink = `/exams/${exam.id}${variantId ? `?variant=${variantId}` : ''}`
  return (
    <>
      <Breadcrumbs items={[{ label: examLabel, to: examLink }, { label: 'Mock test' }]} />
      {screen !== 'running' && <PageHeader eyebrow="Mock test" title={`${examLabel} mock test`} lead={`Practice in the shape of the real paper: ${pattern.stage}.`} />}
      {screen === 'intro' && <MockIntro exam={exam} pattern={pattern} plan={plan} isSample={mockQuestions.isSample} attempts={attemptsFor(examId, variantId)} onStart={() => setScreen('running')} />}
      {screen === 'running' && <MockRunner plan={plan} onFinish={handleFinish} />}
      {screen === 'result' && <MockResult plan={plan} result={finished.result} answers={finished.answers} secondsByQuestion={finished.secondsByQuestion} isSample={mockQuestions.isSample} onRetry={() => setScreen('intro')} />}
    </>
  )
}
