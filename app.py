from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def start():
    return render_template("index.html")

@app.route('/submit', methods = ['POST'])
def crunchData():
	data = request.get_json(force=True)

	adjacencyMatrix = data['adjacency']
	distanceMatrix = data['distance']
	start = data['start']
	end = data['end']

	# Find shortest path
	# 
	# 

	return jsonify([0]);

if __name__ == '__main__':
	app.run(port=5000)