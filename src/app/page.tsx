import Image from 'next/image';

const imageSize = 300;

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="relative h-0 aspect-square overflow-hidden rounded-md shadow-md">
          <Image
            src={`https://picsum.photos/${imageSize}/${imageSize}?random=${i}`}
            alt={`Random Image ${i}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="transition-transform duration-300 hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}

