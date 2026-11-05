const assessmentQuestions = {
  Python: [
    {
      question: "Which keyword is used to create a function in Python?",
      options: ["function", "def", "create", "fun"],
      answer: "def"
    },
    {
      question: "Which data type stores True or False?",
      options: ["int", "str", "bool", "float"],
      answer: "bool"
    },
    {
      question: "What is the output of 2 ** 3?",
      options: ["6", "8", "9", "5"],
      answer: "8"
    },
    {
      question: "Which symbol is used for comments in Python?",
      options: ["//", "#", "/*", "--"],
      answer: "#"
    },
    {
      question: "Which method adds an item to a list?",
      options: ["add()", "insertEnd()", "append()", "push()"],
      answer: "append()"
    }
  ],

  Java: [
    {
      question: "Which keyword is used to create a class in Java?",
      options: ["class", "define", "struct", "object"],
      answer: "class"
    },
    {
      question: "Which method is the starting point of a Java program?",
      options: ["start()", "run()", "main()", "begin()"],
      answer: "main()"
    },
    {
      question: "Which data type stores whole numbers?",
      options: ["String", "int", "boolean", "char"],
      answer: "int"
    },
    {
      question: "Which keyword creates an object?",
      options: ["class", "this", "new", "static"],
      answer: "new"
    },
    {
      question: "Which symbol ends a Java statement?",
      options: [".", ":", ";", ","],
      answer: ";"
    }
  ],

  JavaScript: [
    {
      question: "Which keyword declares a variable that can be reassigned?",
      options: ["const", "let", "fixed", "static"],
      answer: "let"
    },
    {
      question: "Which method prints a message in the browser console?",
      options: ["print()", "echo()", "console.log()", "display()"],
      answer: "console.log()"
    },
    {
      question: "Which value represents an intentional absence of value?",
      options: ["null", "true", "1", "undefined"],
      answer: "null"
    },
    {
      question: "Which operator checks both value and type?",
      options: ["==", "=", "===", "!="],
      answer: "==="
    },
    {
      question: "Which keyword is used to define a function?",
      options: ["func", "function", "def", "method"],
      answer: "function"
    }
  ],

  SQL: [
    {
      question: "Which SQL command retrieves data?",
      options: ["GET", "SELECT", "OPEN", "FETCH ALL"],
      answer: "SELECT"
    },
    {
      question: "Which command adds a new row?",
      options: ["INSERT", "UPDATE", "ALTER", "DELETE"],
      answer: "INSERT"
    },
    {
      question: "Which clause filters rows?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "JOIN"],
      answer: "WHERE"
    },
    {
      question: "Which command removes a table?",
      options: ["DELETE", "DROP", "REMOVE ROW", "CLEAR"],
      answer: "DROP"
    },
    {
      question: "Which function counts rows?",
      options: ["SUM()", "TOTAL()", "COUNT()", "NUMBER()"],
      answer: "COUNT()"
    }
  ],

  DBMS: [
    {
      question: "What does DBMS stand for?",
      options: [
        "Data Backup Management System",
        "Database Management System",
        "Digital Base Management Software",
        "Database Making System"
      ],
      answer: "Database Management System"
    },
    {
      question: "Which key uniquely identifies a row?",
      options: ["Foreign key", "Primary key", "Duplicate key", "Common key"],
      answer: "Primary key"
    },
    {
      question: "What is a collection of related data called?",
      options: ["Database", "Program", "Function", "Network"],
      answer: "Database"
    },
    {
      question: "Which key connects two tables?",
      options: ["Primary key", "Foreign key", "Candidate key", "Super key"],
      answer: "Foreign key"
    },
    {
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Question Language",
        "System Query List",
        "Standard Quick Language"
      ],
      answer: "Structured Query Language"
    }
  ],

  "Data Structures and Algorithms": [
    {
      question: "Which data structure follows LIFO?",
      options: ["Queue", "Stack", "Tree", "Graph"],
      answer: "Stack"
    },
    {
      question: "Which data structure follows FIFO?",
      options: ["Stack", "Queue", "Tree", "Heap"],
      answer: "Queue"
    },
    {
      question: "What is the index of the first element in a Python list?",
      options: ["1", "-1", "0", "2"],
      answer: "0"
    },
    {
      question: "Which search works on a sorted array by repeatedly dividing the search area?",
      options: ["Linear Search", "Binary Search", "DFS", "BFS"],
      answer: "Binary Search"
    },
    {
      question: "Which data structure stores key-value pairs?",
      options: ["Stack", "Queue", "Hash Map", "Array"],
      answer: "Hash Map"
    }
  ],

  "Computer Networks": [
    {
      question: "What does IP stand for?",
      options: [
        "Internet Protocol",
        "Internal Program",
        "Information Process",
        "Internet Program"
      ],
      answer: "Internet Protocol"
    },
    {
      question: "Which device connects different networks?",
      options: ["Keyboard", "Router", "Monitor", "Printer"],
      answer: "Router"
    },
    {
      question: "How many layers are in the OSI model?",
      options: ["4", "5", "7", "8"],
      answer: "7"
    },
    {
      question: "Which protocol is commonly used for secure web browsing?",
      options: ["HTTP", "HTTPS", "FTP", "SMTP"],
      answer: "HTTPS"
    },
    {
      question: "Which protocol is used to send email?",
      options: ["SMTP", "HTTP", "DNS", "IP"],
      answer: "SMTP"
    }
  ],

  "Operating Systems": [
    {
      question: "Which part manages computer hardware and resources?",
      options: ["Browser", "Kernel", "Editor", "Compiler"],
      answer: "Kernel"
    },
    {
      question: "What is a program currently running called?",
      options: ["File", "Process", "Folder", "Thread pool"],
      answer: "Process"
    },
    {
      question: "Which scheduling method uses a fixed time slice?",
      options: ["FCFS", "SJF", "Round Robin", "Priority only"],
      answer: "Round Robin"
    },
    {
      question: "What is the main purpose of memory management?",
      options: [
        "Manage RAM",
        "Print documents",
        "Browse websites",
        "Edit images"
      ],
      answer: "Manage RAM"
    },
    {
      question: "What is deadlock?",
      options: [
        "A computer restart",
        "Processes waiting forever for resources",
        "A file deletion",
        "A type of memory"
      ],
      answer: "Processes waiting forever for resources"
    }
  ]
};

export default assessmentQuestions;