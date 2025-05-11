const IsMobile = () => {
    const userAgent = window.navigator.userAgent
    return /Mobi|Android/i.test(userAgent)
}

export default IsMobile
