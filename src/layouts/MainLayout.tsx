import { Outlet } from 'react-router-dom'
import VotingGuide from '@/components/guide/VotingGuide'

const MainLayout = () => {
  return (
    <main className='overflow-hidden'>
      <Outlet/>
      <VotingGuide/>
    </main>
  )
}

export default MainLayout