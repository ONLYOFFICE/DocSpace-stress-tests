import os
import sys

TESTS = {
    "1": ("Files CRUD",   "dist/file.js"),
    "2": ("Folders CRUD", "dist/folder.js"),
    "3": ("Rooms CRUD",   "dist/room.js"),
}

def show_menu():
    print("\n┌─────────────────────────────┐")
    print("│     DocSpace Stress Tests   │")
    print("├─────────────────────────────┤")
    for key, (name, _) in TESTS.items():
        print(f"│  {key}. {name:<27}│")
    print("│  q. Quit                    │")
    print("└─────────────────────────────┘")

def load_config():
    print("Loading config from .env...")
    result = os.system("npx ts-node config/init/index.ts")
    if result != 0:
        print("Warning: failed to load config, using existing config.json")

def run_test(path, extra_args=""):
    cmd = f"k6 run {path}"
    if extra_args:
        cmd += f" {extra_args}"
    print(f"\nRunning: {cmd}\n")
    os.system(cmd)

def main():
    load_config()

    while True:
        show_menu()
        choice = input("\nSelect test: ").strip().lower()

        if choice == "q":
            print("Bye!")
            sys.exit(0)

        if choice not in TESTS:
            print("Invalid choice, try again.")
            continue

        name, path = TESTS[choice]

        extra = input(f"Extra k6 args (or Enter to skip): ").strip()

        run_test(path, extra)

        again = input("\nRun another test? (y/n): ").strip().lower()
        if again != "y":
            print("Bye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
