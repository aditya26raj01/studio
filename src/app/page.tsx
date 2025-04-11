import Image from 'next/image';

const imageSize = 300;

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 20 }).map((_, i) => {
        const imageUrl = `https://picsum.photos/${imageSize}/${imageSize}?random=${i}`;
        return (
          <div key={i} className="relative h-0 aspect-square overflow-hidden rounded-md shadow-md">
            {
              (() => {
                try {
                  return (
                    <Image
                      src={imageUrl}
                      alt={`Random Image ${i}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  );
                } catch (error: any) {
                  console.error("Error loading image:", error);
                  return (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      Error loading image
                    </div>
                  );
                }
              })()
            }
          </div>
        );
      })}
    </div>
  );
}
