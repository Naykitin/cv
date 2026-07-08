import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollEffects() {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const lenis = new Lenis({ lerp: 0.12, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (!link) {
        return;
      }

      const target = document.querySelector(link.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(target, { offset: -16 });
    };

    document.addEventListener('click', handleAnchorClick);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1px)', () => {
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 44,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        });
      });

      gsap.from('.skill-cloud span', {
        autoAlpha: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.045,
        scrollTrigger: { trigger: '.skill-cloud', start: 'top 90%', once: true },
      });

      gsap.from('.project-list p', {
        autoAlpha: 0,
        x: (index) => (index % 2 ? 64 : -64),
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.project-list', start: 'top 85%', once: true },
      });
    });

    mm.add('(min-width: 981px)', () => {
      gsap.to('.hero-copy', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });

      gsap.to('.hero-showcase', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });

      const section = document.querySelector('.experience-section');
      const track = document.querySelector('.experience-section .timeline');

      if (section && track) {
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return () => {
      mm.revert();
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
