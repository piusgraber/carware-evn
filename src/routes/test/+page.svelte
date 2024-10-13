
<select>
    <option>one</option>
<option>tow</option>
</select>
<input type="text"/>
<button>send</button>
<style>
button,
input[type="text"],
select {
    font-family: 'Arial narrow', sans-serif;
    font-size: 12pt;
    height: 22px;
    padding: 0 8px; /* Adjust padding to maintain the height */
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    outline: none;
}

button:hover,
input[type="text"]:hover,
select:hover {
    border-color: #888;
}

button:focus,
input[type="text"]:focus,
select:focus {
    border-color: #555;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

button {
    background-color: #f0f0f0;
    cursor: pointer;
    line-height: 22px; /* Ensure text is vertically centered */
}

button:hover {
    background-color: #e0e0e0;
}

</style>