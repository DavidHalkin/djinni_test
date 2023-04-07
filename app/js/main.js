'use strict';
document.addEventListener('DOMContentLoaded', () => {

	const btnMob = document.querySelector('.btn_mob_menu_js'),
		closeBtn = document.querySelector('.close_js'),
		menuBlock = document.querySelector('.header_content'),
		scroll = calcScroll();


	function calcScroll() {
		let div = document.createElement('div');

		div.style.width = '50px';
		div.style.height = '50px';
		div.style.overflowY = 'scroll';
		div.style.visibility = 'hidden';

		document.body.appendChild(div);
		let scrollWidth = div.offsetWidth - div.clientWidth;
		div.remove();

		return scrollWidth;
	}

	function openMenu() {
		menuBlock.classList.add('opened');

		document.body.style.overflow = "hidden";
		document.body.style.marginRight = `${scroll}px`;
	}

	function closeMenu() {
		menuBlock.classList.remove('opened');
		document.body.style.overflow = "";
		document.body.style.marginRight = `0px`;
	}
	btnMob.addEventListener('click', (e) => {
		openMenu();
	});
	closeBtn.addEventListener('click', (e) => {
		closeMenu();
	});
	window.addEventListener('resize', () => {
		if (window.screen.availWidth > 992) {
			closeMenu();
		}
	});

	//dropdowns
	let allDropsName = '.custom_dropdown',
		allDropsToggler = `${allDropsName} > .btn`,
		classShowDrop = 'show';

	const dropDowns = document.querySelectorAll(allDropsName),
		dropDownsButton = document.querySelectorAll(allDropsToggler);

	dropDownsButton.forEach(button => {
		button.addEventListener('click', e => {
			const curentDrop = e.target.closest('.btn').parentElement;
			if (curentDrop.classList.contains(classShowDrop)) {
				curentDrop.classList.remove(classShowDrop);
			} else {
				curentDrop.classList.add(classShowDrop);
			}

			const dropMenu = button.nextElementSibling;
			dropMenu.addEventListener('click', e => {
				button.parentElement.classList.remove(classShowDrop);
			});
			if (e.target.closest('.btn').hasAttribute('data-change')) {
				const dropMenu = button.nextElementSibling;
				dropMenu.addEventListener('click', e => {
					if (e.target.closest('a')) {
						button.querySelector('span').innerHTML = e.target.closest('a').innerHTML;
					}
				});
			}
			closeOutDropdowns();
		});
	});
	dropDowns.forEach(drop => {
		drop.addEventListener('click', control);
	});

	function control(event) {
		const clickedElem = event.target;
		if (clickedElem.closest('a')) {
			event.preventDefault();
		}
		for (const drop of dropDowns) {
			if (clickedElem.closest(allDropsName) === drop) continue;
			drop.classList.remove(classShowDrop);
			// removeActiveFilterBblock();
		}
	}

	function closeOutDropdowns() {
		document.addEventListener('click', function (e) {
			if (e.target.closest(allDropsName) === null) {
				const drops = document.querySelectorAll(allDropsName);
				drops.forEach(element => {
					element.classList.remove(classShowDrop);
					element.firstElementChild.classList.remove(classShowDrop);
				});
			}
		});
	}

	const cardContainer = document.querySelector('#infinity_section');
	const cards = cardContainer.querySelectorAll('.column');

	const txtMore = 'Show more...';
	const txtLess = 'Show less...';

	function addMoreBtn() {
		cards.forEach(item => {
			const paragraph = item.querySelector('p');
			const more = item.querySelector('.more_btn');

			if (paragraph.scrollHeight > paragraph.clientHeight) {
				// paragraph.classList.add('bg-warning');

				if (more) {
					more.innerHTML = `<a href="#" class="text-decoration-none text-dark btn_more_js">${txtMore}</a>`;
				} else {
					const newMore = document.createElement('div');
					newMore.classList.add('more_btn');
					if (paragraph.classList.contains('opened')) {
						newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark btn_more_js">${txtLess}</a>`;
					} else {
						newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark btn_more_js">${txtMore}</a>`;
					}
					item.querySelector('.card-body').appendChild(newMore);
					newMore.addEventListener('click', (e) => {
						e.preventDefault();
						paragraph.classList.toggle('opened');
						if (paragraph.classList.contains('opened')) {
							newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark btn_more_js">${txtLess}</a>`;
						} else {
							newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark btn_more_js">${txtMore}</a>`;
						}
					});
				}
			} else {
				// paragraph.classList.remove('bg-warning');
				paragraph.classList.remove('opened');
				if (more) {
					more.remove();
				}
			}
		});
	}

	addMoreBtn();
	window.addEventListener('resize', addMoreBtn);

	// This is hardcod. I don't know how to write the correct condition. If we open the paragraph and resize it by 1 pixel, then the button disappears. If we resize it by another pixel, then everything is normal.
	window.addEventListener('orientationchange', addMoreBtn);


	const switchers = document.querySelectorAll('.btn_toggler input[type=radio]');


	function goDark(params) {
		document.querySelectorAll('.text-light').forEach((styles) => {
			styles.classList.replace('text-light', 'text-dark');
		});
	}

	function goLight(params) {
		document.querySelectorAll('.text-dark').forEach((styles) => {
			styles.classList.replace('text-dark', 'text-light');
		});
	}
	if (document.body.closest('.dark-mode')) {
		switchers[1].checked = true;
		goLight();
	} else {
		switchers[0].checked = true;
		goDark();
	}

	switchers.forEach(element => {
		element.addEventListener('click', (e) => {

			if (e.target.getAttribute('id') == 'day') {
				document.body.classList.remove('dark-mode');
				goDark();
			} else {
				document.body.classList.add('dark-mode');
				goLight();
			}
		});
	});


});