function NotFoundPage() {
    return (
        <div className="bg-[linear-gradient(336deg,_#46626A_-36.08%,_#242633_83.86%)] w-screen h-screen font-sans text-white flex flex-row items-center justify-center">
            <div className="flex flex-row items-center gap-5">
                <div className="font-bold text-7xl">404</div>
                <div>
                    <div className="font-semibold text-xl">Page Not Found</div>
                    <div className="font-medium text-lg">Shalt thou return to <a href="/" className="underline">thy place</a></div>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage