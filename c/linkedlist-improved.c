#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

// Define a node in a linked list
typedef struct Node {
  int value;
  struct Node *next;
} node;

int main(int argc, char *argv[]) {

  // Define list length
  int N = 10;
  if (argc == 2) {
    N = atoi(argv[1]);
  }

  // Build a linked list
  node *list = NULL;
  node *n = malloc(sizeof(node));
  n->value = 0;
  n->next = NULL;
  list = n;
  node *prev = n;

  for (int i = 1; i < N; i++) {

    // Create a new node, handle possible failure
    node *n = malloc(sizeof(node));
    if (n == NULL) {
      free(list);
      free(n);
      return EXIT_FAILURE;
    };

    // Assign value and initialise NULL pointer
    n->value = i;
    n->next = NULL;
    prev->next = n;
    prev = n;
    if ((N < 1000) | (i % 1000000 == 0)) {
      printf("Created %i node with value %i at\t%p\n", i, n->value, n);
    }
  }

  // Traverse list
  int i = 0;
  for (n = list; n != NULL; n = n->next, i++) {
    if ((N < 1000) | (i % 1000000 == 0)) {
      printf("Node (val=%i, next=%p)\n", n->value, n->next);
    }
  }

  // Free memory
  free(list);
  free(n);

  return EXIT_SUCCESS;
}
