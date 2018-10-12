if [ -d $1 ]; then
    # Handle file exits error
    echo 'error: dir exits'
    exit 1
else
    # Create dir
    mkdir $1
    # Change dir to given dir name
    cd $1
    # Create dir css and js
    mkdir css js
    # Create index.html
    touch index.html css/styles.css js/main.js
    # Write codes into index.html
    echo "<!DOCTYPE>\n<title>Hello</title>\n<h1>Hi</h1>" > index.html
    # Write codes into styles.css
    echo "h1{color: red;}" > css/styles.css
    # Write codes into main.js
    echo "var string = \"Hello World\"\nalert(string)" > js/main.js

    echo 'success'
    exit 0
fi
