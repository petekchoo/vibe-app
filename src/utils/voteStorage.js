export function getUserVotes() {
    const votes = localStorage.getItem("votes");
    return votes ? JSON.parse(votes) : {};
  }
  
export function setUserVote(recId, direction) {
const votes = getUserVotes();
if (direction) {
    votes[recId] = direction; // "up" or "down"
} else {
    delete votes[recId]; // deselect
}
localStorage.setItem("votes", JSON.stringify(votes));
}  