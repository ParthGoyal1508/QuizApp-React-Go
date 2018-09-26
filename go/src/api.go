package main

import (
	"fmt"

	"github.com/gin-contrib/cors" // Why do we need this package?
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/gorilla/sessions"
	"golang.org/x/crypto/bcrypt"
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

type Game struct {
	ID 			uint	`json:"id"`
	Username	string	`json:"username"`
	QuizID		int		`json:"quizid,string"`
	Quizname	string	`json:"quizname"`
	Quizgenre	string	`json:"quizgenre"`
	Score		int		`json:"score"`
}

type Question struct {
	ID		uint	`json:"id"`
	QuizID	int		`json:"quizid,string"`
	Name	string	`json:"name"`
	Type	int		`json:"type"`
	OptA	string	`json:"opta"`
	OptB	string	`json:"optb"`
	OptC	string	`json:"optc"`
	OptD	string	`json:"optd"`
	ValA	bool	`json:"vala"`
	ValB	bool	`json:"valb"`
	ValC	bool	`json:"valc"`
	ValD	bool	`json:"vald"`
}

var store = sessions.NewCookieStore([]byte("secret-password"))

func main() {
	db, err = gorm.Open("sqlite3", "./gorm.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	db.LogMode(true)
	db.Exec("PRAGMA foreign_keys = ON")
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Quiz{})
	db.AutoMigrate(&Question{})
	db.AutoMigrate(&Game{})
	r := gin.New()
	v:=r.Group("")

	r.POST("/login", Login)
	r.POST("/signup", CreateUser)

	v.Use(Auth())
	{
		v.GET("/users/", GetUsers)
		v.DELETE("/users/:id", DeleteUser)

		v.POST("/makequiz",CreateQuiz)
		v.GET("/quiz/", GetQuiz)
		r.DELETE("/quiz/:id", DeleteQuiz)

		v.POST("/addques", CreateQuestion)
		v.GET("/question/:qid", GetQuestion)
		v.DELETE("/delques/:id", DeleteQuestion)
		v.POST("/editques/:id", EditQuestion)
		v.GET("/ques/:id", GetQues)

		v.GET("/genre/:genre", GetQuizName)
		v.GET("/quizid/:qid",GetQuizById)
		v.POST("/updatescore", UpdateScore)

		v.GET("/games/:uname",GetGames)

		v.GET("/leaderboard",Leaderboard)
		v.GET("/leaderboard/:genre",Genreboard)
	}
	r.Use((cors.Default()))
	r.Run(":8080") // Run on port 8080
}

func Auth() gin.HandlerFunc{
	return func(c *gin.Context){
		session, _ := store.Get(c.Request, "session-name")
		fmt.Println(session.Values["authenticated"])
		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			fmt.Println("Fake User")
		}
	fmt.Println("User Authenticated")
	c.Next()
	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func Login(c *gin.Context) {
	var user User
	var users User
	c.BindJSON(&user)
	c.Header("access-control-allow-origin", "http://localhost:3000") // Why am I doing this? Find out. Try running with this line commented
	c.Header("access-control-allow-credentials", "true") // Why am I doing this? Find out. Try running with this line commented
	if user.Username == "" || user.Password == "" {
		c.JSON(404, gin.H{"error": "Fields can't be empty"})
	} else if err := db.Where("username = ?", user.Username).First(&users).Error; err != nil {
		fmt.Println(err)
		c.JSON(404, gin.H{"error": "Incorrect Username or Password"})
	} else {
		match:=CheckPasswordHash(user.Password,users.Password)
		if match == true {
			fmt.Println("USER EXISTS")
			session, _ := store.Get(c.Request, "session-name")
			session.Values["authenticated"] = true
			session.Save(c.Request, c.Writer)
			fmt.Println(session.Values["authenticated"])
			c.JSON(200, user)
		} else {
			c.JSON(404, gin.H{"error": "Incorrect Username or Password"})
		}
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
	} else if err := db.Where("username = ?", user.Username).Or("phone=?", user.Phone).Or("email_id=?", user.EmailID).First(&users).Error; err == nil {
		fmt.Println(err)
		c.JSON(404, gin.H{"error": "User already exists"})
	} else {
		hashpass,_ := HashPassword(user.Password)
		user.Password = hashpass
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

func Logout(c *gin.Context) {
	session, _ := store.Get(c.Request, "cookie-name")
	session.Values["authenticated"] = false
	session.Save(c.Request, c.Writer)
}

func CreateQuiz(c *gin.Context) {
	var quiz Quiz
	var quizzes Quiz
	c.BindJSON(&quiz)
	fmt.Println(quiz)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	if quiz.Name == "" || quiz.Genre == "" {
		c.JSON(404, gin.H{"error": "Fields can't be empty"})
		fmt.Println("Fields Empty")
	} else if err := db.Where("name = ? AND genre=?", quiz.Name,quiz.Genre).First(&quizzes).Error; err == nil {
		fmt.Println(err)
		c.JSON(404, gin.H{"error": "Quiz already exists"})
	}else {
		fmt.Println(err)
		db.Create(&quiz)
		c.JSON(200, quiz)
	}
}

func GetQuiz(c *gin.Context) {
	var quiz []Quiz
	if err := db.Find(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quiz)
	}
}

func DeleteQuiz(c *gin.Context) {
	fmt.Println("WORKING")
	id := c.Params.ByName("id")
	var quiz Quiz
	d := db.Where("id = ?", id).Delete(&quiz)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

func CreateQuestion(c *gin.Context) {
	var ques Question
	c.BindJSON(&ques)
	fmt.Println(ques)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	if ques.Name == "" || ques.OptA == "" || ques.OptB == "" || ques.OptC == "" || ques.OptD == "" {
		c.JSON(400, gin.H{"error": "Fields can't be empty"})
		fmt.Println("Fields Empty")
	} else if (!(ques.ValA || ques.ValB || ques.ValC || ques.ValD)){
		c.JSON(400, gin.H{"error": "Atleast one option should be true"})
		fmt.Println("Atleast one answer to be selected")
	}else {
		fmt.Println(err)
		db.Create(&ques)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, ques)
	}
}

func EditQuestion(c *gin.Context) {
	var question Question
	id := c.Params.ByName("id")
	if err := db.Where("id = ?", id).First(&question).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	c.BindJSON(&question)
	db.Save(&question)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, question)
}

func GetQues(c *gin.Context){
	var question Question
	id := c.Params.ByName("id")
	if err := db.Where("id = ?", id).First(&question).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, question)
	}
}

func GetQuestion(c *gin.Context) {
	var question []Question
	id := c.Params.ByName("qid")
	if err := db.Where("quiz_id = ?",id).Find(&question).Error; err != nil {
		fmt.Println("YOYO")
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, question)
	}
}

func DeleteQuestion(c *gin.Context) {
	fmt.Println("WORKING")
	id := c.Params.ByName("id")
	var question Question
	d := db.Where("id = ?", id).Delete(&question)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

func GetQuizName(c *gin.Context) {
	var quiz []Quiz
	genre := c.Params.ByName("genre")
	if err := db.Where("genre = ?",genre).Find(&quiz).Error; err != nil {
		fmt.Println("YOYO")
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quiz)
	}
}

func GetQuizById(c *gin.Context) {
	var quiz Quiz
	qid := c.Params.ByName("qid")
	if err := db.Where("id = ?",qid).First(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		fmt.Println(quiz)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quiz)
	}
}

func UpdateScore(c *gin.Context) {
	var game Game
	c.BindJSON(&game)
	fmt.Println(game)
	db.Create(&game)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, game)
}

func GetGames(c *gin.Context){
	var game []Game
	uname := c.Params.ByName("uname")
	if err := db.Where("username = ?", uname).Find(&game).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		fmt.Println(game)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, game)
	}
}

func Leaderboard(c *gin.Context){
	var game []Game
	if err := db.Order("score desc").Find(&game).Error; err !=nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, game)
	}
}

func Genreboard(c *gin.Context){
	var game []Game
	genre := c.Params.ByName("genre")
	if err := db.Where("quizgenre = ?",genre).Order("score desc").Find(&game).Error; err !=nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, game)
	}
}