window.onload = function () {

	/* ============================ */
	/* print current date to screen */
	/* ============================ */

	const date = document.getElementById('date');
	const options = { weekday: "long", month: "long", day: "numeric" };
	const today = new Date();
	date.innerHTML = today.toLocaleDateString("ru-RU", options);

	/* ============================= */
	/* toggle selected list of tasks */
	/* ============================= */

	var toggler = document.querySelectorAll('#toggle');

	for (var i = 0; i < toggler.length; i++) {
		toggler[i].onclick = function () {
			if (this.classList.contains('toggle-on')) {
				this.classList.remove('toggle-on');
				this.classList.add('toggle-off');
				this.parentElement.nextElementSibling.classList.add('hidden');
			} else {
				this.classList.remove('toggle-off');
				this.classList.add('toggle-on');
				this.parentElement.nextElementSibling.classList.remove('hidden');
			}
		}
	}

	/* =============== */
	/*    TODO LIST    */
	/* =============== */

	// check if data is not empty
	var data = (localStorage.getItem('data')) ? JSON.parse(localStorage.getItem('data')) : {
		// else init empty arrays
		CURRENT: [],
		COMPLETE: []
	};

	GetDataToLocalStorage();

	// function get data from LocalStorage
	function GetDataToLocalStorage() {
		if (!data.CURRENT.length && !data.COMPLETE.length) return;

		for (var i = 0; i < data.CURRENT.length; i++) {
			var task = data.CURRENT[i];
			createElem(task);
			document.getElementById('current-tasks').innerText = data.CURRENT.length;
		}

		for (var j = 0; j < data.COMPLETE.length; j++) {
			var task = data.COMPLETE[j];
			createElem(task, true);
			document.getElementById('complete-tasks').innerText = data.COMPLETE.length;
		}
	}

	// function add new task to array 
	var btn_add = document.getElementById('add-task');
	btn_add.addEventListener('click', function () {
		var input = document.getElementById('new-task').value;
		if (input) {
			addNewTask(input);
		} else {
			alert('Введите название задачи!');
			return false;
		}
	})

	// function add new task after key ENTER
	document.addEventListener("keypress", function (event) {
		var input = document.getElementById('new-task').value;
		if (event.keyCode === 13) {
			if (input) {
				addNewTask(input);
			} else {
				alert('Введите название задачи!');
				return false;
			}
		}
	})

	// function add new tasks to array 
	function addNewTask(task) {
		createElem(task);
		clearInput();
		data.CURRENT.push(task);
		SetDataToLocalStorage();
		CountLengthArr();
	}

	// function remove tasks from array 
	function removeTask() {
		let removeMsg = confirm("Удалить данную задачу?");
		if (removeMsg) {
			let Elem = this.parentNode,
				ElemList = Elem.parentNode,
				ElemID = Elem.parentNode.id,
				ElemTask = Elem.firstChild.innerText;

			if (ElemID === 'current') {
				data.CURRENT.splice(data.CURRENT.indexOf(ElemTask), 1);
			} else {
				data.COMPLETE.splice(data.COMPLETE.indexOf(ElemTask), 1);
			}

			SetDataToLocalStorage();
			ElemList.removeChild(Elem);
			CountLengthArr();
		}
	}

	// function check tasks to array 
	function completeTask() {
		var Elem = this.parentNode,               // li 
			ElemList = Elem.parentNode,           // ul
			ElemID = Elem.parentNode.id,          // ul#id 
			ElemTask = Elem.firstChild.innerText, // text of <p>
			ElemSel;                              // select

		if (ElemID === 'current') {
			data.CURRENT.splice(data.CURRENT.indexOf(ElemTask), 1);
			data.COMPLETE.push(ElemTask);
		} else {
			data.COMPLETE.splice(data.COMPLETE.indexOf(ElemTask), 1);
			data.CURRENT.push(ElemTask);
		}

		SetDataToLocalStorage();

		ElemList.removeChild(Elem);
		if (ElemID === 'current') {
			ElemSel = document.getElementById('complete');
			Elem.classList.add('check');
			Elem.firstChild.classList.add('lineThrough');
			Elem.lastChild.innerHTML = '&#8634';
		} else {
			ElemSel = document.getElementById('current');
			Elem.classList.remove('check');
			Elem.firstChild.classList.remove('lineThrough');
			Elem.lastChild.innerHTML = '&#10004';
		}

		ElemSel.insertBefore(Elem, ElemSel.childNodes[0]);
		CountLengthArr();
	}

	// function create elements to DOM 
	function createElem(task, complete) {
		var list, item, nameTask, btn_del, btn_done;
		if (complete) {
			// START check if selected list-complete  
			list = document.getElementById('complete');

			item = document.createElement('li');
			item.classList.add('todo__item', 'check');

			nameTask = document.createElement('p');
			nameTask.classList.add('todo__text', 'lineThrough');
			nameTask.innerText = task;

			btn_del = document.createElement('span');
			btn_del.classList.add('todo__btn', 'todo__btn-remove');
			btn_del.innerHTML = '&#10008';
			btn_del.addEventListener('click', removeTask);

			btn_done = document.createElement('span');
			btn_done.classList.add('todo__btn', 'todo__btn-check');
			btn_done.innerHTML = '&#8634';
			btn_done.addEventListener('click', completeTask);
			// END check if selected list-complete

		} else {
			// START check if selected list-current
			list = document.getElementById('current');

			item = document.createElement('li');
			item.classList.add('todo__item');

			nameTask = document.createElement('p');
			nameTask.classList.add('todo__text');
			nameTask.innerText = task;

			btn_del = document.createElement('span');
			btn_del.classList.add('todo__btn', 'todo__btn-remove');
			btn_del.innerHTML = '&#10008';
			btn_del.addEventListener('click', removeTask);

			btn_done = document.createElement('span');
			btn_done.classList.add('todo__btn', 'todo__btn-check');
			btn_done.innerHTML = '&#10004';
			btn_done.addEventListener('click', completeTask);
			// END check if selected list-current
		}

		item.appendChild(nameTask);
		item.appendChild(btn_del);
		item.appendChild(btn_done);
		list.appendChild(item);
	}

	// function count length arrays 
	function CountLengthArr() {
		var len_cur, len_com;

		for (var i = 0; i < data.CURRENT.length; i++) {
			len_cur = data.CURRENT.length;
		}

		for (var i = 0; i < data.COMPLETE.length; i++) {
			len_com = data.COMPLETE.length;
		}

		document.getElementById('current-tasks').innerText = (len_cur) ? len_cur : '0';
		document.getElementById('complete-tasks').innerText = (len_com) ? len_com : '0';
	}

	// function set data to LocalStorage
	function SetDataToLocalStorage() {
		localStorage.setItem('data', JSON.stringify(data));
	}

	// function clear input 
	function clearInput() {
		document.getElementById('new-task').value = '';
	}
}