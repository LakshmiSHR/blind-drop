import clsx from 'clsx'
import styles from './GlowButton.module.css'

interface GlowButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  href?: string
  className?: string
}

export function GlowButton({
  children,
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  href,
  className,
}: GlowButtonProps) {
  const classes = clsx(
    styles.btn,
    size !== 'md' && styles[size],
    className
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
