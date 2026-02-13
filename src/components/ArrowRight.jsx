import imgVector from '../assets/1dc6845aa3a0c77fca2a593666616dbef5d6758e.svg'
import imgVector1 from '../assets/6dd3543cacbe31481f8bdf150aa445667703666a.svg'

export default function ArrowRight() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2">
        <div className="absolute inset-[-0.5px_-5.36%]">
          <img alt="" className="block max-w-none size-full" src={imgVector} />
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-[20.83%] top-[20.83%]">
        <div className="absolute inset-[-5.36%_-10.71%]">
          <img alt="" className="block max-w-none size-full" src={imgVector1} />
        </div>
      </div>
    </div>
  )
}
