package main

import (
	"fmt"

	"github.com/gin-contrib/cors" // Why do we need this package?
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/gorilla/sessions"
	_ "github.com/jinzhu/gorm/dialects/sqlite" // If you want to use mysql or any other db, replace this line
)

var db *gorm.DB // declaring the db globally
var err error

type User struct {
	ID       uint   `json:"id"`
	EmailID  string `json:"emailid"`
	Phone    string `json:"phone"`
	Username string `json:"username"`
	Password string `json:"password"`
	City     string `json:"city"`
}

type Quiz struct {
	ID		uint	`json:"id"`
	Genre	string	`json:"genre"`
	Name	string	`json:"name"`
}

type Question struct {
	ID		uint	`json:"id"`
	QuizID	int		`json:"quizid"`
	Name	string	`json:"name"`
	Type	string	`json:"type"`
	OptA	string	`json:"opta"`
	OptB	string	`json:"optb"`
	OptC	string	`json:"optc"`
	OptD	string	`json:"optd"`
	ValA	int		`json:"vala"`
	ValB	int		`json:"valb"`
	ValC	int		`json:"valc"`
	ValD	int		`json:"vald"`
}

var store = sessions.NewCookieStore([]byte("secret-password"))

func main() {
	db, err = gorm.Open("sqlite3", "./gorm.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{})
	r := gin.Default()
	r.POST("/signup", CreateUser)
	r.POST("/login", Login)
	r.GET("/users/", GetUsers)
	r.DELETE("/users/:id", DeleteUser)
	r.POST("/addques", CreateQuestion)
	r.Use((cors.Default()))
	r.Run(":8080") // Run on port 8080
}

// func Auth(c *gin.Context) {
// 	session, _ := store.Get(c.Request, "cookie-name")

// 	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
// 		http.Error(w, "Forbidden", http.StatusForbidden)
// 		return
// 	}

// 	// Print secret message
// 	fmt.Fprintln(w, "The cake is a lie!")
// }

func Login(c *gin.Context) {
	var user User
	var users User
	c.BindJSON(&user)
	c.Header("access-control-allow-origin", "http://localhost:3000") // Why am I doing this? Find out. Try running with this line commented
	c.Header("access-control-allow-credentials", "true") // Why am I doing this? Find out. Try running with this line commented
	if user.Username == "" || user.Password == "" {
		c.JSON(404, gin.H{"error": "Fields can't be empty"})
	} else if err := db.Where("username = ? AND password = ?", user.Username, user.Password).First(&users).Error; err != nil {
		fmt.Println(err)
		c.JSON(404, gin.H{"error": "Incorrect Username or Password"})
	} else {
		fmt.Println("USER EXISTS")
		session, _ := store.Get(c.Request, "session-name")
		session.Values["authenticated"] = true
		session.Save(c.Request, c.Writer)
		c.JSON(200, user)
	}
}

func CreateUser(c *gin.Context) {
	var user User
	var users User
	c.BindJSON(&user)
	fmt.Println(user)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	if user.Username == "" || user.Password == "" || user.Phone == "" || user.EmailID == "" || user.City == "" {
		c.JSON(404, gin.H{"error": "Fields can't be empty"})
		fmt.Println("Fields Empty")
	} else if err := db.Where("username = ?", user.Username).Or("phone=?", user.Phone).First(&users).Error; err == nil {
		fmt.Println(err)
		c.JSON(404, gin.H{"error": "User already exists"})
	} else {
		fmt.Println(err)
		db.Create(&user)
		c.JSON(200, user)
	}
}

func GetUsers(c *gin.Context) {
	var user []User
	if err := db.Find(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, user)
	}
}

func DeleteUser(c *gin.Context) {
	fmt.Println("WORKING")
	id := c.Params.ByName("id")
	var user User
	d := db.Where("id = ?", id).Delete(&user)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// func Logout(c *gin.Context) {
// 	session, _ := store.Get(c.Request, "cookie-name")
// 	session.Values["authenticated"] = false
// 	session.Save(c.Request, c.Writer)
// }

// func UpdatePerson(c *gin.Context) {
// 	var person Person
// 	id := c.Params.ByName("id")
// 	if err := db.Where("id = ?", id).First(&person).Error; err != nil {
// 		c.AbortWithStatus(404)
// 		fmt.Println(err)
// 	}
// 	c.BindJSON(&person)
// 	db.Save(&person)
// 	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 	c.JSON(200, person)
// }

// func GetPerson(c *gin.Context) {
// 	id := c.Params.ByName("id")
// 	var person Person
// 	if err := db.Where("id = ?", id).First(&person).Error; err != nil {
// 		c.AbortWithStatus(404)
// 		fmt.Println(err)
// 	} else {
// 		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 		c.JSON(200, person)
// 	}
// }



func CreateQuestion(c *gin.Context) {
	var ques Question
	c.BindJSON(&ques)
	fmt.Println(ques)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	if ques.Name == "" || ques.OptA == "" || ques.OptB == "" || ques.OptC == "" || ques.OptD == ""  {
		c.JSON(404, gin.H{"error": "Fields can't be empty"})
		fmt.Println("Fields Empty")
	} else {
		fmt.Println(err)
		db.Create(&ques)
		c.JSON(200, ques)
	}
}