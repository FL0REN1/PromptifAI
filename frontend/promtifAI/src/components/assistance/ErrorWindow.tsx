import { useRef } from 'react'
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax'
import styles from '../../css/styles.module.css'
import AnimatedPage from './AnimatedPage';

interface PageProps {
    offset: number;
    gradient: string;
    onClick: () => void;
    text: string;
}

const Page = ({ offset, gradient, onClick, text }: PageProps) => (
    <>
        <ParallaxLayer offset={offset} speed={0.2} onClick={onClick}>
            <div className={styles.slopeBegin} />
        </ParallaxLayer>

        <ParallaxLayer offset={offset} speed={0.6} onClick={onClick}>
            <div className={`${styles.slopeEnd} ${styles[gradient]}`} />
        </ParallaxLayer>

        <ParallaxLayer className={`${styles.text} ${styles.number}`} offset={offset} speed={0.3}>
            <span>{text}</span>
        </ParallaxLayer>
    </>
)

export default function ErrorWindow() {
    const parallax = useRef<IParallax>(null)

    const scroll = (to: number) => {
        if (parallax.current) {
            parallax.current.scrollTo(to)
        }
    }

    return (
        <AnimatedPage>
            <div style={{ background: '#dfdfdf', height: '100vh' }}>
                <Parallax className={`${styles.container} paralaxError`} ref={parallax} pages={3}>
                    <Page offset={0} gradient="pink" onClick={() => scroll(1)} text="Error" />
                    <Page offset={1} gradient="teal" onClick={() => scroll(2)} text="404" />
                    <Page offset={2} gradient="tomato" onClick={() => scroll(0)} text="👾" />
                </Parallax>
            </div>
        </AnimatedPage>
    )
}