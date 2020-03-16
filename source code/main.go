package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
)

var serverPort int

func init() {
	flag.IntVar(&serverPort, "p", 8080, "Specify which port to listen on. Default = 8080")
}

func main() {
	log.Println("RSR Webmap v1.0")
	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("./webmap"))
	mux.Handle("/", http.StripPrefix("/", neuter(fileServer)))
	log.Println(fmt.Sprintf("Listening on port %d.", serverPort))
	err := http.ListenAndServe(fmt.Sprintf(":%d", serverPort), mux)
	log.Fatal(err)
}

func neuter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			http.NotFound(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}
