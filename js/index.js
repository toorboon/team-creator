function ready(callbackFunc) {
  if (document.readyState !== 'loading') {
    // Document is already ready, call the callback directly
    callbackFunc();
  } else if (document.addEventListener) {
    // All modern browsers to register DOMContentLoaded
    document.addEventListener('DOMContentLoaded', callbackFunc);
  } else {
    // Old IE browsers
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') {
        callbackFunc();
      }
    });
  }
}

ready(function() {

	var test_array = 0;
	var source_array = [];
	var obj_csv = {size:0, dataFile:[]};
	var super_res_array = [];
	var team_size = 0;

	// Manual description in teams div
	document.querySelector('#teams').innerHTML = '<p class="m-5 text-center">Please first import a csv file with just one column containing the potential team members. After that you will see the imported result under "Source". You can than enter a number of team-members a team can consist of and hit the calculate button. The export can after that be exported!</p>';
	 	
	
	// eventhandler
	document.querySelector('#clear-button').addEventListener('click',function() {
		clearTeams();
	});

	document.querySelector('#uploadfile').addEventListener('change',function(e) {
		source_array = [];
		super_res_array = [];
		readFile(e.target);
	});

	// document.querySelector("#test-button").addEventListener('click', function() {
	// 	console.log(source_array);
	// 	console.log(source_array.length)
	// });

	document.querySelector("#calculate-button").addEventListener('click', function() {
		calc_array = copyArray(source_array);
		team_size = document.querySelector('#team-size').value;
		calculate(calc_array, team_size);
	});

	document.querySelector('#team-size').addEventListener('keypress',function(e) {
		if(e.key === 'Enter'){
			calc_array = copyArray(source_array);
			team_size = document.querySelector('#team-size').value;
			calculate(calc_array, team_size);
		}
	});

	document.querySelector("#export-button").addEventListener('click', function() {
		// Maybe add here a stopper function if the state of the app is not ready you cannot proceed!
		const date = new Date()
		const date_string = (date.getFullYear() + '_' + date.getDate() + '_' + (date.getMonth()+1) + "_" + date.getHours() + (( date.getMinutes() < 10 ? "0" : "" ) + date.getMinutes()) + (( date.getSeconds() < 10 ? "0" : "" ) + date.getSeconds()))
		export_csv(super_res_array, ';', 'team_export_' + date_string, team_size);
	});

 	// file import functions
	function readFile(input) {
		clearTeams();
		clearSource();
	    // console.log(input)
		 if (input.files && input.files[0]) {
			 let reader = new FileReader();
			        reader.readAsBinaryString(input.files[0]);
			 reader.onload = function (e) {
			 	// console.log(e);
			 	obj_csv.size = e.total;
			 	obj_csv.dataFile = e.target.result
			        // console.log(obj_csv.dataFile)
			        parseData(obj_csv.dataFile)          
		 	}
	 	}
	 	document.querySelector('#uploadfile').value = '';
	 	document.querySelector('#teams').innerHTML = '<h3 class="m-5 text-center bg-secondary">Your file was imported to Source container, please now hit the button calculate after you inserted a team-size.</h3>';
	 	
	}
 
	function parseData(data){
	    let csvData = [];
	    let lbreak = data.split("\n");
	    lbreak.forEach(res => {
	        csvData.push(res.split(";"));
	    });
	    // console.table(csvData);
	    arr = csvData;
	    source_array = [];

	    // console.log('length: ' + arr.length)
	    for(let i = arr.length -1; i > -1; i--){
	    	// console.log('item: ' + arr[i])
	    	if (arr[i] != "") {
	    		source_array.push(arr[i][0]);
	    		// console.log('source_array: ' + source_array)
	    	}
    	}
	    
	    const source_div = document.getElementById('source');

		for (let i = source_array.length-1; i > -1; i--) {
			source_div.insertAdjacentHTML('beforeend', '<span>' + source_array[i] + ', </span>');
		}	
	}

	// calculate teams functions	
	function calculate(arr, num){
		clearTeams();
		
		if(typeof num == 'undefined' || num == null || num < 1 ){
			document.querySelector('#teams').innerHTML = '<h1 class="m-5 text-center bg-danger">Sorry, but Team members must be set to a positive number!</h1>'
			return
		}
		if(typeof arr == 'undefined' || arr == null || arr.length < 1){
			document.querySelector('#teams').innerHTML = '<h1 class="m-5 text-center bg-danger">Sorry, but you have not chosen a file to deal with! Import only csv files!</h1>'
			return
		}

		const teams_div = document.getElementById('teams');

		for(let i = 1; arr.length > 0; i++) {
			const res_array = chooseRandom(arr, num)
			teams_div.insertAdjacentHTML('beforeend', '<div class="card text-success mx-1 mb-2"><div class="card-body"><h5 class="card-title">Team ' + i + '</h5><p id="team' + i + '" class="card-text"></p></div></div>')
			
			super_res_array.push(res_array);

			for(let j = res_array.length; j > 0; j--){
				const team_div = document.getElementById('team' + i);
				team_div.insertAdjacentHTML('beforeend',res_array[j-1] + '<br>');
				// console.log('result_array_position' + j + ': ' + res_array[j-1]);
			}
		}
		// console.log(super_res_array)
		// console.log('super_res: ' + super_res_array[0][1])

	}

	function chooseRandom(arr, num){
		const res = [];
	    for(let i = 0; i < num; i++){
	      const random = Math.floor(Math.random() * arr.length);
	      if(res.indexOf(arr[random]) !== -1){
	      	continue;
	      };
	      if(arr.length === 0){
	      	return res;
	      }

	      res.push(arr[random]);
	      arr.splice(random,1);
	      // console.log('reduced_array: ' + arr);
	      // console.log(arr.filter((name, index) => index === random))
	    };
	    return res;
	}

	// export csv function
	function export_csv(arrayData, delimiter, fileName, team_size) {
        // Build header
        let csv = 'Team;'
        for (i = 1; i <= team_size; i++){
        	csv += 'Member_' + i + delimiter;
        }
        csv += "\n";

        var team_nr = 1;
        arrayData.forEach( team => {
        	csv += 'Team '+team_nr+delimiter;
        	team_nr++;
        	csv += team.join(delimiter) + "\n";
        	// console.log(team)
        });

        let csvData = new Blob([csv], { type: 'text/csv' });  
        let csvUrl = URL.createObjectURL(csvData);

        let hiddenElement = document.createElement('a');
        hiddenElement.href = csvUrl;
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName + '.csv';
        hiddenElement.click();
    }

	//utility functions
	function copyArray(arr){
		const copy_array = [];
		for(let i = arr.length; i > 0; i--){
			copy_array.push(arr[i-1]);
		}
		return copy_array;		
	}

	function clearTeams(){
		document.querySelector("#teams").innerHTML = '';		
	}

	function clearSource(){
		document.querySelector("#source").innerHTML = '';
	}
});	

