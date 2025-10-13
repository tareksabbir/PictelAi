"use client";
import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "../_components/Header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  //@ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };
  //@ts-ignore
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Get in Touch</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Have questions about pictelAI? We'd love to hear from you. Send us
              a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-black">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="border-2 border-gray-300 focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="border-2 border-gray-300 focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="border-2 border-gray-300 focus:border-black resize-none"
                    />
                  </div>

                  {submitted && (
                    <Alert className="border-2 border-black bg-gray-50">
                      <AlertDescription className="text-black">
                        Thank you for contacting us! We'll get back to you soon.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-black text-white hover:bg-gray-800 font-medium py-6 text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border-2 border-black mt-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="w-5 h-5 text-black" />
                  <div className="text-center">
                    <p className="font-medium text-black">Business Hours</p>
                    <p className="text-sm text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
