import { Mail, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-primary/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl font-extrabold mb-3">
              <span className="text-primary">SMICR</span>
              <span className="text-foreground"> Lab</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Structural Mechanics, Inference, and Computational Research Lab — Department of Applied Mechanics, IIT Delhi. Advancing probabilistic machine learning for structural systems.
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
                  Digital Twins
                </a>
              </li>
              <li>
                <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Structural Health Monitoring
                </a>
              </li>
              <li>
                <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Physics-Informed Machine Learning
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="mailto:rajdipn@iitd.ac.in"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              rajdipn@iitd.ac.in
            </a>
            <a
              href="https://www.linkedin.com/in/rajdipnayek1989/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} SMICR Lab, IIT Delhi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
