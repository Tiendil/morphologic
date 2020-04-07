
const COLORS = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey']


function constructAvatar(index) {
    return {color: COLORS[index % COLORS.length],
            uid: index}
}


export {constructAvatar}
