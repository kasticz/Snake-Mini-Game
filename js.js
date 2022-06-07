let startButton = document.querySelector('.startGame')
let gameCells = [...document.querySelectorAll('.gameCell')]
let gameWrapper = document.querySelector('.gameWrapper')
let foodCounter = document.querySelector(`.foodCounter`)
let difficulties = document.querySelectorAll('.difficulty')


let randGap = 1 / gameCells.length
let rows = +gameWrapper.dataset.rows
let columns = +gameWrapper.dataset.columns
let cellsInRow = +gameWrapper.dataset.cellsinrow





function startGame(){
    let gameSpeed = 500
    let lastKeyDown = "left"
    let newCellIndex
    let preHeadIndex
    let keyPressed;
    let gameInterval;
    let pointsCounter = 0;
    

    difficulties.forEach((item)=>{
        if(item.dataset.active === `true`){
            gameSpeed = +item.dataset.speed
        }
    })
    let speedModificator = gameSpeed === 500 ? 20 : gameSpeed > 349 ? 10 : 7



    makeSnake()
    document.addEventListener(`keydown`,onKeyDown)
    makeDot()
    let currSnake = [...gameWrapper.querySelectorAll('[data-snake = true')]
    let headIndex = gameCells.indexOf(currSnake[0])
    let tailIndex = gameCells.indexOf(currSnake[currSnake.length - 1]) 

    defaultSnakeMove() 


    function moveSnake(lastKeyDown){             
         headIndex = gameCells.indexOf(currSnake[0])
         tailIndex = gameCells.indexOf(currSnake[currSnake.length - 1])   
         
         preHeadIndex = gameCells.indexOf(currSnake[1])      
         
         
         
        
        switch (lastKeyDown){
            case "up":            
                    newCellIndex = headIndex - 9
                    if(!checkCrash(newCellIndex,"up")){
                        makeNewHead(newCellIndex)
                        leaveTail(tailIndex,newCellIndex) 
                    } 
                                           
                break;
            case "down":               
                    newCellIndex = headIndex + 9 
                    if(!checkCrash(newCellIndex,"down")){
                        makeNewHead(newCellIndex)
                        leaveTail(tailIndex,newCellIndex) 
                    }                           
                break;
            case "left":              
                    newCellIndex = headIndex - 1
                    if(!checkCrash(newCellIndex,"left")){
                        makeNewHead(newCellIndex)
                        leaveTail(tailIndex,newCellIndex) 
                    }                       
                break;
            case "right":         
                    newCellIndex = headIndex + 1 
                    if(!checkCrash(newCellIndex,"right")){
                        makeNewHead(newCellIndex)
                        leaveTail(tailIndex,newCellIndex) 
                    }                     
                break;
        }        
    }

    function onKeyDown(e){
        headIndex = gameCells.indexOf(currSnake[0])
        tailIndex = gameCells.indexOf(currSnake[currSnake.length - 1])   
        
        preHeadIndex = gameCells.indexOf(currSnake[1])  
       
        let buttonPressed = e.code
        keyPressed = true;
        switch (buttonPressed){
            case("ArrowUp"):
                if(getDisabledDirection(headIndex,preHeadIndex,"up")){
                    lastKeyDown = 'up'
                    moveSnake("up")                    
                }else{
                    keyPressed = false
                }     
                    break;
            case("ArrowDown"):
                if(getDisabledDirection(headIndex,preHeadIndex,"down")){
                    lastKeyDown = 'down'
                    moveSnake("down")                
                }  else{
                    keyPressed = false
                }           
                    break;
            case("ArrowLeft"):
                if(getDisabledDirection(headIndex,preHeadIndex,"left")){
                    lastKeyDown = 'left'
                    moveSnake("left")            
                }else{
                    keyPressed = false
                }  
                    break;
            case("ArrowRight"):
                if(getDisabledDirection(headIndex,preHeadIndex,"right")){
                    lastKeyDown = 'right'
                    moveSnake("right")                  
                }else{
                    keyPressed = false
                }  

                    break;
        }

            
    }
    function getDisabledDirection(headIndex,preHeadIndex,direction){
        let headRow = Math.floor(headIndex / rows)
        let headColumn = headIndex - (Math.floor(headIndex / columns) * columns)

        let preHeadRow = Math.floor(preHeadIndex / rows)
        let preHeadColumn = preHeadIndex - (Math.floor(preHeadIndex / columns) * columns)

        if(direction == "right" || direction == "left"){
            if(headColumn - preHeadColumn == 0){
                return true;
            }
            return (Math.abs(headColumn - preHeadColumn) != 1)                      
        }   
        if(headRow - preHeadRow == 0){
            return true
        }
        return (Math.abs(headRow - preHeadRow) != 1)

    }

    function makeDot(){         
        let randomDot = Math.ceil(Math.random() /randGap) - 1  
        while(gameCells[randomDot].dataset.snake === "true"){
            randomDot = Math.ceil(Math.random() /randGap) - 1
        }      
        gameCells[randomDot].style.backgroundColor = 'black'
        gameCells[randomDot].dataset.food = "active"
    }
    function makeNewHead(cellIndex){
        gameCells[cellIndex].style.background = `green`
        gameCells[cellIndex].dataset.snake = `true`
        currSnake.unshift(gameCells[cellIndex])        
    }
    function makeSnake(){
        startButton.removeEventListener(`click`,startGame)
        let mediumRow = Math.ceil(rows / 2) - 1
        let startColumn = Math.floor(columns / 2) - 1
        for(let i = 0; i < 3 ;i++){
            gameCells[mediumRow * rows + startColumn + i].style.background = `green`
            gameCells[mediumRow * rows + startColumn + i].dataset.snake = true;
        }
    }
    function leaveTail(cell,newHeadIndex){
        if(gameCells[newHeadIndex].dataset.food === "active"){
            makeDot()
            gameCells[newHeadIndex].dataset.food = "inActive"
            pointsCounter++;
            increaseScore()
            increaseSpeed()
            return         
        }
        gameCells[cell].style.background = `white`
        gameCells[cell].dataset.snake = `false`
        currSnake.pop()
    }
    
    function checkCrash(headDestination,direction){
        if(headDestination < 0 || headDestination >= gameCells.length || gameCells[headDestination].dataset.snake === "true"){
            gameOver()
            return true;
        }
        if(direction === "right" && ((headDestination) % 9) === 0){
            gameOver()
            return true;
        }
        if(direction === "left" && ((headDestination + 1) % 9) === 0){          
            gameOver()
            return true;
        }

    }
   function gameOver(){
    clearInterval(gameInterval)
    document.removeEventListener(`keydown`,onKeyDown)    

    for( i = 0; i < currSnake.length;i++){
        currSnake[i].style.background = "white"
        currSnake[i].dataset.snake = `false`
    }
    for(let i = 0; i < gameCells.length;i++){
        if(gameCells[i].dataset.food = `active`){
            gameCells[i].style.backgroundColor = `white`
            gameCells[i].dataset.food = `inActive`
        }
    }  
    let gameOverWindow = document.querySelector('.gameOver')
    gameOverWindow.style.display = `flex`
    gameOverWindow.innerHTML = `Your final score is ${pointsCounter}`
    document.addEventListener(`click`,gameOverClick)
    foodCounter.innerHTML = `Current score is ${0}`
    function gameOverClick(e){
        if (e.target.contains(gameOverWindow)){
            gameOverWindow.style.display = `none`
            document.removeEventListener(`click`,gameOverClick)
            startButton.addEventListener(`click`,startGame)
        }
    }
    }
    function increaseScore(){
        foodCounter.innerHTML = `Current score is ${pointsCounter}`
    }
    function increaseSpeed(){
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {
            if(!keyPressed){
                moveSnake(lastKeyDown)
            }else{
                keyPressed = false;
            }
            
        }, gameSpeed - pointsCounter * speedModificator);
    }
    function defaultSnakeMove(){
        gameInterval = setInterval(() => {
            if(!keyPressed){
                moveSnake(lastKeyDown)
            }else{
                keyPressed = false;
            }
            
        }, gameSpeed);
    }
}


startButton.addEventListener(`click`,startGame)

difficulties.forEach((item)=>{
    item.addEventListener(`click`,difficultyClick)
})
function difficultyClick(e){
    difficulties.forEach(item => item.dataset.active = "false")
    e.target.dataset.active = `true`
}






