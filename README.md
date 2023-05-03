# Novelsapi
Website to gather and download japanese lightnovels from thatnovelcorner.com. When you land on the site, it will show all the series that it has, showed by the book 

main page
----------------
cover
![image](https://user-images.githubusercontent.com/47357440/216651774-0102d11c-66a3-4a5b-98b7-534f29f04fb0.png)

When you click on a cover image, it will open it in a overlay that will show the book cover, annd buttons for each volume. When you click on a volume, it will automatically start to donwloading the book. This can be used with calibre server, and it's automatic email function to download an in this case, send the book to kindle automatically
In addition, the book cover in the overlay will open a link to the website, of the series. You can exit th overlay by pressing anywhere on the screen, that is away from the central buttons.
The first line is the title of the series, followed by the names, that book search will recognize
![book](https://user-images.githubusercontent.com/47357440/215523535-9eb2f50f-a135-4c2c-a994-c28acc2d66fc.png)

The bar above the books is the seach bar, and it will remove all the books not found in search form view. 
![seach](https://user-images.githubusercontent.com/47357440/215525352-498b23da-9d41-47f7-9404-e0c51a25f0c6.png)

Find new books
----------------------

![image](https://user-images.githubusercontent.com/47357440/216651893-84855707-bd91-4465-aa49-5acb79ef59da.png)
default view
![image](https://user-images.githubusercontent.com/47357440/216652007-b2e8d940-4982-46b0-becf-b467c2a74768.png)

when books ar found

# Api
/api/findseries
--------------
Searches for new series, given the name

/api/series
------------------
Saves given json into db.json

/api/json
-----------------
returns all saved json

api/modify
----------------
modifies json, when given an index


# Commands
To run locally, run npm start in the main folder and in frontend folder. To build into docker image, run npm run build.
