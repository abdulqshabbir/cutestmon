interface RingSpinnerProps {
  fullScreen?: boolean
  width?: string
}

export const RingSpinner = ({
  fullScreen = false,
  width
}: RingSpinnerProps) => {
  if (width && !fullScreen) {
    return (
      <div className=" flex items-center justify-center">
        <div
          className={`h-[${width}] w-[${width}] animate-spin  rounded-full border-8 border-solid border-gray-300 border-t-transparent`}
        ></div>
      </div>
    )
  }
  return (
    <div className="absolute right-1/2 bottom-1/2  translate-x-1/2 translate-y-1/2 transform ">
      <div className="h-64 w-64 animate-spin  rounded-full border-8 border-solid border-gray-300 border-t-transparent"></div>
    </div>
  )
}
