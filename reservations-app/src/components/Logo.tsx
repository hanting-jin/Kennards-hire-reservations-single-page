import type { MouseEvent } from 'react';

export interface LogoProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  clickable?: boolean;
  onClick?: () => void;
}

const Logo = ({
  src,
  alt = 'Logo',
  width = 120,
  height = 24,
  clickable = false,
  onClick,
}: LogoProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!clickable) return;
    onClick?.();
    event.preventDefault();
  };

  const image = (
    <img src={src} alt={alt} width={width} height={height} className="block object-contain" />
  );

  if (clickable) {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center"
        onClick={handleClick}
      >
        {image}
      </button>
    );
  }

  return <div className="inline-flex items-center justify-center">{image}</div>;
};

export default Logo;
