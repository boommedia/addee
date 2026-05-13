import AppNav from '@/components/AppNav'
import HelpAccordion from '@/components/HelpAccordion'
import { HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Help & Tutorials — Bloggy',
  description: 'Step-by-step guides for every Bloggy feature — WordPress setup, AutoBlog, keyword research, rankings tracking, team management, and more.',
  robots: { index: false, follow: false },
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0]">
      <AppNav active="/help" />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-white">Help & Tutorials</h1>
          </div>
          <p className="text-[#8888a8] text-sm">Step-by-step guides for every Bloggy feature.</p>
        </div>

        <HelpAccordion />
      </main>
    </div>
  )
}
