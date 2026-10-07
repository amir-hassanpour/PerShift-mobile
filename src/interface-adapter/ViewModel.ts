export class ViewModel {
  private listeners = new Set<() => void>();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  async firePropertyChange(): Promise<void> {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
