import React from 'react';

interface Props {
    amount: number | string | null | undefined;
    currency?: string;
    showSign?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function MoneyDisplay({
    amount,
    currency = 'MXN',
    showSign = false,
    size,
    className = '',
}: Props) {
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount ?? '0')) || 0;

    const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency || 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(num));

    const sign = num < 0 ? '-' : (showSign && num > 0 ? '+' : '');

    const sizeClass = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-2xl',
    }[size || 'md'];

    return (
        <span className={`tabular-nums font-medium ${sizeClass} ${className}`}>
            {sign}{formatted}
        </span>
    );
}
