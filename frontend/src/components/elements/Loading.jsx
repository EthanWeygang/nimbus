function Loading(){
    return(
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-charcoal">Loading your files...</h2>
            </div>
        </div>
    )
}

export default Loading;