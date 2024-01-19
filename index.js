const userInfoContainer = document.getElementById("user-info")
const reposList = document.querySelector(".repos")
const pagination = document.getElementById("pagination")
const loading = document.querySelector(".loading")
const usernameInput = document.getElementById("username")
usernameInput.addEventListener("keypress", (e) => {
 if (e.key == "Enter") {
  fetchD()
 }
})
let perPage
let currentPage
function fetchD() {
 perPage = 10
 currentPage = 1
 userInfoContainer.style.display = "none"
 pagination.innerHTML = ""
 fetchData()
}
async function fetchData() {
 const usernameInput = document.getElementById("username")
 const username = usernameInput.value.trim()

 if (!username) {
  alert("Please enter a valid GitHub username.")
  return
 }
 loading.style.display = "flex"
 reposList.style.display = "none"
 const userUrl = `https://api.github.com/users/${username}`
 const reposUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`

 try {
  const [userResponse, reposResponse] = await Promise.all([
   fetch(userUrl),
   fetch(reposUrl),
  ])

  var userData = await userResponse.json()
  loading.style.display = "none"

  if (userData.message === "Not Found") {
   alert("user nor found")
  } else {
   var repos = await reposResponse.json()
   displayUserInfo(userData)
   displayRepos(repos)
   displayPagination(userData.public_repos)
  }
 } catch (error) {
  alert(error)
  return
 } finally {
  reposList.style.display = "flex"
  userInfoContainer.style.display = "flex"
 }
}

function displayUserInfo(user) {
 userInfoContainer.innerHTML = `
        <div class="user_img">
          <img src=${user.avatar_url} alt=${user.login} />
          <div style="margin-top:10px;"> <a href="${user.html_url}" >${
  user.html_url
 }</a></div>
          </div>
         <div class="user_bio"> <div class="user_bio_details"style="font-size:25px;font-weight:bold;">${
          user.login
         }</div>
         <div class="user_bio_details"> ${user.name || "Not available"}</div>
                  <div class="user_bio_details"> ${user.bio || ""}</div>

         <div class="user_bio_details">${
          user.location
           ? `<i class="fa-solid fa-location-dot"></i>   ` + user.location
           : ""
         }</div>
         <div class="user_bio_details">${
          user.twitter_username
           ? `<i class="fa-brands fa-twitter"></i> ` +
             `<a href="https://twitter.com/${user.twitter_username}">${user.twitter_username}</a>`
           : ""
         }</div>
         </div>
       `
}

function displayRepos(repos) {
 reposList.innerHTML = ""

 repos.forEach((repo) => {
  const repoItem = document.createElement("div")
  repoItem.className = "repo-item"
  repoItem.innerHTML = `
           <p class="repo_details" style="font-size:20px;font-weight:bold;">${
            repo.name
           }</p>
           <div class="repo_details"> ${
            repo.description || "No description available"
           }</div>
           <div > ${
            repo.topics
             .map((e) => `<button class="btn">${e}</button>`)
             .join(" ") || "No topics available"
           }</div>
         `
  reposList.appendChild(repoItem)
 })
}

function displayPagination(repoCount) {
 const totalPages = Math.ceil(repoCount / perPage)
 pagination.innerHTML = ""

 const prevButton = document.createElement("button")
 prevButton.innerText = "Previous"
 prevButton.className = "pagination-button"
 prevButton.disabled = currentPage === 1
 prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
   currentPage--
   fetchData()
  }
 })
 pagination.appendChild(prevButton)

 for (let i = 1; i <= totalPages; i++) {
  const pageButton = document.createElement("button")
  pageButton.innerText = i
  pageButton.className = "pagination-button"
  if (i === currentPage) {
   pageButton.classList.add("active")
  }
  pageButton.addEventListener("click", () => {
   currentPage = i
   fetchData()
  })
  pagination.appendChild(pageButton)
 }

 const nextButton = document.createElement("button")
 nextButton.innerText = "Next"
 nextButton.className = "pagination-button"
 nextButton.disabled = currentPage === totalPages
 nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
   currentPage++
   fetchData()
  }
 })
 pagination.appendChild(nextButton)
}
