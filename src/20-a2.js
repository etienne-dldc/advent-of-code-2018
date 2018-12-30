(() => {

    content = document.querySelector('pre').innerText;

    const input = content.split('\n')[0];
   
    class Map{
      constructor(){
        this.rows = {};
      }

      addNode(node){
        this.set(node.x, node.y, node);
      }

      getRow(y){
        return this.rows[y] || (this.rows[y] = {});
      }

      set(x, y, node){
        this.getRow(y)[x] = node;
      }

      get(x, y){
        return this.getRow(y)[x] || {x, y, dist:Number.POSITIVE_INFINITY};
      }
    }


    function process(input){
      const chars = input.trim().split("");

      let currentNode = {x:0, y:0, dist:0};
      const stack = [currentNode];
      const map = new Map();

      function add(dx, dy){
        const node = map.get(currentNode.x + dx, currentNode.y + dy);
        node.dist = Math.min(node.dist, currentNode.dist + 1);
        currentNode = node;
        map.addNode(node);
      }

      chars.forEach(c => {
        switch(c){
          case "N": add(0, -1); break;
          case "S": add(0, 1); break;
          case "E": add(1, 0); break;
          case "W": add(-1, 0); break;
          case "(": stack.push(currentNode); break;
          case ")": currentNode = stack.pop(); break;
          case "|": currentNode = stack[stack.length - 1]; break;
          default:break;
        }
      });

      const dists = [];
      for(let r in map.rows){
        for(let k in map.rows[r]){
          dists.push(map.rows[r][k].dist);
        }
      }

      console.log(dists.length)

      return dists.filter(d => d >= 1000).length;//uncomment for part 2
      // return Math.max.apply(undefined, dists);
    }


    // console.log(process("^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$"), 23);
    // console.log(process("^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$"), 31);
    console.log(process(input)); 


})()