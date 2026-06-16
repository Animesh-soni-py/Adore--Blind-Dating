import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'
import AdminRoute from './components/auth/AdminRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const MatchesPage = lazy(() => import('./pages/MatchesPage'))
const ProfileSetupPage = lazy(() => import('./pages/ProfileSetupPage'))
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'))
const PersonalityQuizPage = lazy(() => import('./pages/PersonalityQuizPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const CitySelectionPage = lazy(() => import('./pages/CitySelectionPage'))
const AdminPaymentsPage = lazy(() => import('./pages/AdminPaymentsPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="font-body text-sm text-white/40">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/personality-quiz" element={<PersonalityQuizPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/city-selection" element={<CitySelectionPage />} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPaymentsPage /></AdminRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
