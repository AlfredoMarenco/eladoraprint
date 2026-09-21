import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className,
    animation = 'fade-up',
    delay = 0,
    duration = 700,
    threshold = 0.1,
    once = true,
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (once && domRef.current) {
                            observer.unobserve(domRef.current);
                        }
                    } else if (!once) {
                        setIsVisible(false);
                    }
                });
            },
            { threshold }
        );

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, once]);

    const getAnimationClasses = () => {
        switch (animation) {
            case 'fade-up':
                return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12';
            case 'fade-in':
                return isVisible ? 'opacity-100' : 'opacity-0';
            case 'slide-left':
                return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12';
            case 'slide-right':
                return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12';
            default:
                return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12';
        }
    };

    return (
        <div
            ref={domRef}
            className={cn(
                'transition-all ease-out',
                getAnimationClasses(),
                className
            )}
            style={{ 
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
}
