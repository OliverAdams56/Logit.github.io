<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Allow the page to scale to device -->
  <title>Log It - Web</title>
  <link rel="stylesheet" href="style.css"> 
</head>

<body> <!-- the body around the container -->
  <div class="container"> <!-- The main container where everything is being housed -->
    <header>
      <h1>Log It</h1>
      <p>Rank your favorite movies and shows</p> <!-- the header for the container -->
    </header>

    <section class="form-section"> <!-- All the forms in the container goes here -->
      <input type="text" id="title" placeholder="Title (e.g. Inception)">
      <textarea id="reason" placeholder="Why do you like it?"></textarea>
      <input type="number" id="rank" placeholder="Rank (1-10)" min="1" max="10">
      <button id="add-btn">Add to Log</button> <!-- the add button to add entried to the container -->
    </section>

    <hr>

    <section id="log-list" class="log-list"> <!--second section renders/ show movies added to the list -->
      <button id="clear-all-btn" class="secondary-btn">Clear All Entries</button> <!-- clears all input -->
    </section>

  </div>
  <script src="script.js"></script>
</body>

</html>
