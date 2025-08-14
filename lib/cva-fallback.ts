type VariantProps<T> = T extends (...args: any[]) => any ? Parameters<T>[0] : never

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

const clsx = (...classes: ClassValue[]): string => {
  return classes.flat().filter(Boolean).join(" ")
}

interface VariantConfig {
  variants?: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
}

export const cva = (base: string, config?: VariantConfig) => {
  return (props?: Record<string, any>) => {
    let result = base

    if (config?.variants && props) {
      Object.entries(props).forEach(([key, value]) => {
        if (config.variants?.[key]?.[value]) {
          result = clsx(result, config.variants[key][value])
        }
      })
    }

    if (config?.defaultVariants) {
      Object.entries(config.defaultVariants).forEach(([key, value]) => {
        if (!props?.[key] && config.variants?.[key]?.[value]) {
          result = clsx(result, config.variants[key][value])
        }
      })
    }

    return result
  }
}

export type { VariantProps }
