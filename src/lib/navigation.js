/**
 * Navigation link lists shared by the header, mobile menu, footer, home and tools pages.
 */
import { UserCheck, GitCompareArrows, Layers, IndianRupee, ChartLine, CalendarDays, Target } from 'lucide-react'

export const regionLinks = [
  { to: '/central', label: 'Central' },
  { to: '/andhra-pradesh', label: 'Andhra Pradesh' },
  { to: '/telangana', label: 'Telangana' },
]

export const toolLinks = [
  { to: '/plan', label: 'Your plan', icon: Target, text: 'What to aim for and prepare, from your profile.' },
  { to: '/eligibility', label: 'Eligibility checker', icon: UserCheck, text: 'See which exams fit your age, category and degree.' },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows, text: 'Up to four exams side by side.' },
  { to: '/syllabus', label: 'Syllabus overlap', icon: Layers, text: 'Find exams you can prepare for together.' },
  { to: '/salary', label: 'Salary and career', icon: IndianRupee, text: 'Pay level, allowances, in-hand estimate and promotions.' },
  { to: '/analytics', label: 'Cutoffs and selection', icon: ChartLine, text: 'Official cutoffs, vacancies and selection rates.' },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, text: 'Official dates and recruitment status.' },
]
