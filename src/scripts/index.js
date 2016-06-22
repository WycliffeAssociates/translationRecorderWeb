document.addEventListener('DOMContentLoaded', function() {
	
	// Toggle menu when clicking the menu icon
	document.querySelector('.menuIcon').addEventListener('click', toggleMenu);
	// Close menu when clicking on the menu links
	document.querySelectorAll('.menu span a').forEach(function(a) {
		a.addEventListener('click', hideMenu);
	});
	
});

function showMenu() {
	document.querySelector('.menu').classList.add('show');
	document.querySelector('.menuIcon_close').style.display = 'block';
	document.querySelector('.menuIcon_menu').style.display = 'none';
	document.addEventListener('click', dismissMenu);
}

function hideMenu() {
	document.querySelector('.menu').classList.remove('show');
	document.querySelector('.menuIcon_close').style.display = 'none';
	document.querySelector('.menuIcon_menu').style.display = 'block';
	document.removeEventListener('click', dismissMenu);
}

function toggleMenu() {
	document.querySelector('.menu').classList.contains('show') ? hideMenu() : showMenu();
}

function dismissMenu (e) {
	!closest(e.target, 'nav') && hideMenu();
}
