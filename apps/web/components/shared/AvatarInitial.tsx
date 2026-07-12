export const avatarColors = [
  'bg-pastel-rose',
  'bg-pastel-sky',
  'bg-pastel-amber',
  'bg-pastel-emerald',
  'bg-pastel-violet',
  'bg-pastel-cyan',
  'bg-pastel-orange',
  'bg-pastel-lime',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface AvatarInitialProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

export function AvatarInitial({ name, size = 'md', color }: AvatarInitialProps) {
  const bgColor = color || getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-xl flex items-center justify-center font-semibold text-ix-dark flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
