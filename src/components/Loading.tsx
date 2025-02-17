const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin-slow"></div>
      </div>
    </div>
  )
}

export default Loading 