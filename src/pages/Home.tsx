import TopNavBar from '../components/NavBar'
import MobileNavbar from '@/components/MobileNavbar'
import IsMobile from '@/utils/helpers/isMobile'
import mainBg from '@/assets/main-bg.png'
import { AspectRatio, Image } from '@chakra-ui/react'
import getUserInfo from '@/utils/helpers/getUserInfo'

const Home = () => {
    const user = getUserInfo()
    const classes = JSON.parse(user?.class || '[]') as { label: string }[]
    const isClient = classes.some(({ label }) => label === 'Реализатор')

    return (
        <>
            {IsMobile() && isClient ? <MobileNavbar /> : <TopNavBar />}
            <AspectRatio height='90dvh' ratio={1920 / 1080}>
                <Image src={mainBg} alt='bg' objectFit='cover' />
            </AspectRatio>
        </>
    )
}

export default Home
