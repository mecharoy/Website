export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-primary/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl font-extrabold mb-3">
              <span className="text-primary">[Lab</span>
              <span className="text-foreground"> Name]</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              [Placeholder: One or two sentences about the lab's mission and home institution.]
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="#team" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Team
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3">Research Areas</h4>
            <ul className="space-y-2">
              <li>
                <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  [Research Area 1]
                </a>
              </li>
              <li>
                <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  [Research Area 2]
                </a>
              </li>
              <li>
                <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  [Research Area 3]
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} [Lab Name], [University Name]. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
