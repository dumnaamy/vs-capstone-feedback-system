import React, { useEffect, useState } from 'react';
import '../styles/universe-background.css';

const UniverseBackground = () => {
	const [bgIndex, setBgIndex] = useState(0);
	const totalSlides = 4;

	useEffect(() => {
		// Create stars dynamically
		const starsContainer = document.querySelector('.stars');
		if (starsContainer) {
			// Clear existing stars
			starsContainer.innerHTML = '';
			// Create 200 stars
			for (let i = 0; i < 200; i++) {
				const star = document.createElement('div');
				star.className = `star ${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`;
				star.style.left = `${Math.random() * 100}%`;
				star.style.top = `${Math.random() * 100}%`;
				star.style.animationDelay = `${Math.random() * 3}s`;
				starsContainer.appendChild(star);
			}
		}
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setBgIndex((prev) => (prev + 1) % totalSlides);
		}, 6000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className={`universe-background bg-${bgIndex}`}>
			<div className="stars"></div>
			<div className="nebula nebula1"></div>
			<div className="nebula nebula2"></div>
			<div className="nebula nebula3"></div>
			<div className="galaxy"></div>
			<div className="shooting-star"></div>
			<div className="shooting-star"></div>
			<div className="shooting-star"></div>
			<div className="shooting-star"></div>
			<div className="depth-layer"></div>
		</div>
	);
};

export default UniverseBackground;
