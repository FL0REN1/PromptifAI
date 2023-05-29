import { InfinitySpin } from "react-loader-spinner";
import '../../css/loaderWindow.css'
import AnimatedPage from "./AnimatedPage";

export default function LoaderWindow(newStyle) {
    return (
        <AnimatedPage>
            <div className={newStyle ? "loaderWindow loaderWindowUpdate" : "loaderWindow"}>
                <InfinitySpin
                    width='200'
                    color="#3b9e58"
                />
            </div>
        </AnimatedPage>
    )
}