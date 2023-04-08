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





	// add show more btn

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
					more.innerHTML = `<a href="#" class="text-decoration-none text-dark">${txtMore}</a>`;
				} else {
					const newMore = document.createElement('div');
					newMore.classList.add('more_btn');
					if (paragraph.classList.contains('opened')) {
						newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark">${txtLess}</a>`;
					} else {
						newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark">${txtMore}</a>`;
					}
					item.querySelector('.card-body').appendChild(newMore);
					newMore.addEventListener('click', (e) => {
						e.preventDefault();
						paragraph.classList.toggle('opened');
						if (paragraph.classList.contains('opened')) {
							newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark">${txtLess}</a>`;
						} else {
							newMore.innerHTML = `<a href="#" class="text-decoration-none text-dark">${txtMore}</a>`;
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




	// switch dark mode 


	const switchers = document.querySelectorAll('.btn_toggler input[type=radio]');

	function setDarkMode() {
		document.querySelectorAll('.text-light').forEach((styles) => {
			styles.classList.replace('text-light', 'text-dark');
		});
	}

	function setLightMode() {
		document.querySelectorAll('.text-dark').forEach((styles) => {
			styles.classList.replace('text-dark', 'text-light');
		});
	}
	if (document.body.closest('.dark-mode')) {
		switchers[1].checked = true;
		setLightMode();
	} else {
		switchers[0].checked = true;
		setDarkMode();
	}

	switchers.forEach(element => {
		element.addEventListener('click', (e) => {

			if (e.target.getAttribute('id') == 'day') {
				document.body.classList.remove('dark-mode');
				setDarkMode();
			} else {
				document.body.classList.add('dark-mode');
				setLightMode();
			}
		});
	});








	// load more cards
	let pageCouner = 1;
	let isLoading = false;

	const getResourse = async (url) => {
		let res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};


	function showMoreCards(wrapper) {

		function toDo() {
			getResourse(`https://picsum.photos/v2/list?page=${pageCouner}&limit=9`)
				.then(res => cardCreate(res))
				.catch(error => console.log(error));
		}

		window.addEventListener('load', () => {
			toDo();
			pageCouner++;
			console.log(pageCouner);
		}, {
			once: true
		});

		window.addEventListener('scroll', () => {
			const documentRect = document.documentElement.getBoundingClientRect();

			if (documentRect.bottom < document.documentElement.clientHeight + 150 && !isLoading) {
				isLoading = true;
				toDo();
				pageCouner++;
				console.log(pageCouner);
			}

		});

		function cardCreate(response) {
			isLoading = false;
			response.forEach(({
				url,
				author,
				download_url
			}) => {
				let dataCard = document.createElement('div');
				dataCard.classList.add('col-12', 'col-sm-6', 'column');
				dataCard.innerHTML = `
					<div class="card">
						<div class="img_holder">
							<img src="${download_url}" class="card-img-top" alt="...">
						</div>
						<div class="card-body">
							<h5 class="card-title text-dark font-weight-bold">${author}</h5>
							<p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat fugaLorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat fuga</p>
						</div>
						<div class="card-footer px-3 bg-transparent">
							<div class="row mx-n2">
								<div class="col-12 col-md-auto px-2">
									<a href="${url}" target="_blank" class="btn btn-warning font-weight-bold px-3">Save to collection</a>
								</div>
								<div class="col-12 col-md-auto px-2">
									<button class="btn btn-outline-light text-dark font-weight-bold  px-3">Share</button>
								</div>
							</div>
						</div>
					</div>
				`;
				document.querySelector(wrapper).appendChild(dataCard);

			});
		}

	}

	showMoreCards('#infinity_section');
});