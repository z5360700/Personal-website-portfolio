"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Mail, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import emailjs from "@emailjs/browser"

export default function Contact() {
  const ref = useRef(null)
  const formRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("3kDBty53SrIKYNJe-")
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage("")

    try {
      console.log("Attempting to send email with data:", formData)

      // EmailJS configuration
      const serviceId = "service_ses81fd"
      const templateId = "template_gqb6o4h"

      // Template parameters that match your EmailJS template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: "Michael Lo Russo",
        reply_to: formData.email,
      }

      console.log("Sending with params:", templateParams)

      const result = await emailjs.send(serviceId, templateId, templateParams)

      console.log("EmailJS result:", result)

      if (result.status === 200) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`)
      }
    } catch (error) {
      console.error("EmailJS error details:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-foreground/80">
            I'd love to hear from you! Any feedback is welcome, this website took way too long to make lol
          </p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Contact Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xl font-bold mb-6">Contact Info</h3>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href="mailto:lorussom28@gmail.com"
                          className="text-foreground/70 hover:text-primary transition-colors"
                        >
                          lorussom28@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-foreground/70">Sydney, Australia</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <a
                        href="https://www.linkedin.com/in/michael-lo-russo/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-3 bg-muted rounded-full hover:bg-primary/20 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your message..."
                          rows={5}
                          required
                          disabled={isSubmitting}
                          className="min-h-[120px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full sm:w-auto flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>

                      {/* Status Messages */}
                      {submitStatus === "success" && (
                        <div className="text-green-600 text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          ✅ Thanks for your message! I'll get back to you soon.
                        </div>
                      )}
                      {submitStatus === "error" && (
                        <div className="text-red-600 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          ❌ Sorry, there was an error sending your message. Please try again or email me directly.
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
