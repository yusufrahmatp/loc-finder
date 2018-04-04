from flask import Flask, render_template, request, jsonify
import AStar as AS

app = Flask(__name__)

@app.route("/")
def start():
    return render_template("index.html")

@app.route('/submit', methods = ['POST'])
def crunchData():
	data = request.get_json(force=True)

	adjacencyMatrix = data['adjacency']
	distanceMatrix = data['distance']
	start = int(data['start'])
	end = int(data['end'])
	
	print(type(start))
	print(type(adjacencyMatrix[1][0]))


	# Find shortest path
	listOfShortestPath = AS.AStar(adjacencyMatrix, distanceMatrix, start, end)
	print(listOfShortestPath)
	return jsonify(listOfShortestPath)

if __name__ == '__main__':
	app.run(port=5000)
