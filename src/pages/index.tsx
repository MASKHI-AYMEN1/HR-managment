import { Hero } from '@/features/Home/Hero'
import { Categories } from '@/features/Home/Categories'
import { JobListings } from '@/features/Home/JobListings'
import PublicLayout from '@/layouts/PublicLayout'

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <Categories />
      <JobListings />
    </PublicLayout>
  )
}
