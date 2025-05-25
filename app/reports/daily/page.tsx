"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2, Save, Activity } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useWebSocket } from "@/lib/websocket-context"
import { useAuth } from "@/lib/auth-context"
import { RealTimeConnectionStatus } from "@/components/real-time-connection-status"

export default function RealTimeDailyReportPage() {
  const { toast } = useToast()
  const { sendMessage } = useWebSocket()
  const { user } = useAuth()
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    prayerChain: {
      fromTime: "",
      toTime: "",
    },
    studyGroup: {
      status: "",
      uploadType: "",
      title: "",
      file: null as File | null,
    },
    prayerGroup: {
      days: [] as string[],
      notPrayed: false,
      reason: "",
    },
    discipleship: [] as Array<{
      name: string
      timeline: string
      subject: string
      hasBible: boolean
      didWrite: boolean
      discussedAttendance: boolean
    }>,
    evangelism: [] as Array<{
      name: string
      address: string
      phone: string
      status: string
    }>,
    healing: [] as Array<{
      name: string
      comment: string
    }>,
  })

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (user) {
        setIsAutoSaving(true)

        // Send auto-save data via WebSocket
        sendMessage({
          type: "auto_save_daily_report",
          data: formData,
          userId: user.id,
          timestamp: Date.now(),
        })

        setLastSaved(new Date())
        setIsAutoSaving(false)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [formData, user, sendMessage])

  // Real-time form synchronization
  useEffect(() => {
    const handleFormUpdate = (data: any) => {
      if (data.type === "form_update" && data.userId === user?.id) {
        setFormData(data.formData)
        toast({
          title: "Form Updated",
          description: "Your form has been synchronized across devices.",
        })
      }
    }

    // In a real implementation, you would subscribe to WebSocket messages here
    // This is a placeholder for the real-time sync functionality
  }, [user, toast])

  const addDiscipleshipEntry = () => {
    if (formData.discipleship.length < 10) {
      const newEntry = {
        name: "",
        timeline: "",
        subject: "",
        hasBible: false,
        didWrite: false,
        discussedAttendance: false,
      }

      setFormData({
        ...formData,
        discipleship: [...formData.discipleship, newEntry],
      })

      // Send real-time update
      sendMessage({
        type: "form_field_update",
        data: { field: "discipleship", action: "add", entry: newEntry },
        userId: user?.id,
        timestamp: Date.now(),
      })
    }
  }

  const addEvangelismEntry = () => {
    if (formData.evangelism.length < 100) {
      const newEntry = {
        name: "",
        address: "",
        phone: "",
        status: "",
      }

      setFormData({
        ...formData,
        evangelism: [...formData.evangelism, newEntry],
      })

      sendMessage({
        type: "form_field_update",
        data: { field: "evangelism", action: "add", entry: newEntry },
        userId: user?.id,
        timestamp: Date.now(),
      })
    }
  }

  const addHealingEntry = () => {
    if (formData.healing.length < 100) {
      const newEntry = {
        name: "",
        comment: "",
      }

      setFormData({
        ...formData,
        healing: [...formData.healing, newEntry],
      })

      sendMessage({
        type: "form_field_update",
        data: { field: "healing", action: "add", entry: newEntry },
        userId: user?.id,
        timestamp: Date.now(),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate prayer chain time (AM only)
    if (formData.prayerChain.fromTime && formData.prayerChain.toTime) {
      const fromHour = Number.parseInt(formData.prayerChain.fromTime.split(":")[0])
      const toHour = Number.parseInt(formData.prayerChain.toTime.split(":")[0])

      if (fromHour >= 12 || toHour >= 12) {
        toast({
          title: "Invalid Time",
          description: "Prayer chain times must be in AM only.",
          variant: "destructive",
        })
        return
      }
    }

    // Send real-time report submission
    sendMessage({
      type: "daily_report_submitted",
      data: {
        reportData: formData,
        userName: user?.fullName || user?.email,
        userId: user?.id,
        submittedAt: new Date().toISOString(),
      },
      userId: user?.id,
      timestamp: Date.now(),
    })

    toast({
      title: "Report Submitted",
      description: "Your daily report has been submitted and synchronized in real-time.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <RealTimeConnectionStatus />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold ml-4">Real-Time Daily Report</h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAutoSaving && (
                <div className="flex items-center text-sm text-blue-600">
                  <Activity className="h-4 w-4 mr-1 animate-spin" />
                  Auto-saving...
                </div>
              )}
              {lastSaved && <div className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</div>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  sendMessage({
                    type: "manual_save_daily_report",
                    data: formData,
                    userId: user?.id,
                    timestamp: Date.now(),
                  })
                  setLastSaved(new Date())
                  toast({ title: "Saved", description: "Report saved successfully." })
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prayer Chain */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Prayer Chain
                  <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Sync</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromTime">From Time (AM only)</Label>
                    <Input
                      id="fromTime"
                      type="time"
                      value={formData.prayerChain.fromTime}
                      onChange={(e) => {
                        const newData = {
                          ...formData,
                          prayerChain: { ...formData.prayerChain, fromTime: e.target.value },
                        }
                        setFormData(newData)

                        // Send real-time update
                        sendMessage({
                          type: "field_update",
                          data: { field: "prayerChain.fromTime", value: e.target.value },
                          userId: user?.id,
                          timestamp: Date.now(),
                        })
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="toTime">To Time (AM only)</Label>
                    <Input
                      id="toTime"
                      type="time"
                      value={formData.prayerChain.toTime}
                      onChange={(e) => {
                        const newData = {
                          ...formData,
                          prayerChain: { ...formData.prayerChain, toTime: e.target.value },
                        }
                        setFormData(newData)

                        // Send real-time update
                        sendMessage({
                          type: "field_update",
                          data: { field: "prayerChain.toTime", value: e.target.value },
                          userId: user?.id,
                          timestamp: Date.now(),
                        })
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Group */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Study Group
                  <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Sync</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.studyGroup.status}
                    onValueChange={(value) => {
                      const newData = {
                        ...formData,
                        studyGroup: { ...formData.studyGroup, status: value },
                      }
                      setFormData(newData)

                      sendMessage({
                        type: "field_update",
                        data: { field: "studyGroup.status", value },
                        userId: user?.id,
                        timestamp: Date.now(),
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.studyGroup.status === "completed" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Upload Type</Label>
                      <Select
                        value={formData.studyGroup.uploadType}
                        onValueChange={(value) => {
                          const newData = {
                            ...formData,
                            studyGroup: { ...formData.studyGroup, uploadType: value },
                          }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: "studyGroup.uploadType", value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select upload type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soft_copy">Soft Copy (PDF)</SelectItem>
                          <SelectItem value="hard_copy">Hard Copy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="studyTitle">Study Title</Label>
                      <Input
                        id="studyTitle"
                        value={formData.studyGroup.title}
                        onChange={(e) => {
                          const newData = {
                            ...formData,
                            studyGroup: { ...formData.studyGroup, title: e.target.value },
                          }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: "studyGroup.title", value: e.target.value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                        placeholder="Enter study title"
                      />
                    </div>

                    {formData.studyGroup.uploadType === "soft_copy" && (
                      <div>
                        <Label htmlFor="studyFile">Upload PDF (Max 10MB)</Label>
                        <Input
                          id="studyFile"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            const newData = {
                              ...formData,
                              studyGroup: { ...formData.studyGroup, file },
                            }
                            setFormData(newData)

                            if (file) {
                              sendMessage({
                                type: "file_upload_started",
                                data: { fileName: file.name, fileSize: file.size },
                                userId: user?.id,
                                timestamp: Date.now(),
                              })
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prayer Group */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Prayer Group
                  <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Sync</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notPrayed"
                    checked={formData.prayerGroup.notPrayed}
                    onCheckedChange={(checked) => {
                      const newData = {
                        ...formData,
                        prayerGroup: { ...formData.prayerGroup, notPrayed: checked as boolean, days: [] },
                      }
                      setFormData(newData)

                      sendMessage({
                        type: "field_update",
                        data: { field: "prayerGroup.notPrayed", value: checked },
                        userId: user?.id,
                        timestamp: Date.now(),
                      })
                    }}
                  />
                  <Label htmlFor="notPrayed">I have not prayed this week</Label>
                </div>

                {formData.prayerGroup.notPrayed ? (
                  <div>
                    <Label htmlFor="prayerReason">Reason (Max 5000 characters)</Label>
                    <Textarea
                      id="prayerReason"
                      value={formData.prayerGroup.reason}
                      onChange={(e) => {
                        const newData = {
                          ...formData,
                          prayerGroup: { ...formData.prayerGroup, reason: e.target.value },
                        }
                        setFormData(newData)

                        sendMessage({
                          type: "field_update",
                          data: { field: "prayerGroup.reason", value: e.target.value },
                          userId: user?.id,
                          timestamp: Date.now(),
                        })
                      }}
                      maxLength={5000}
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Days of Prayer</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={formData.prayerGroup.days.includes(day)}
                            onCheckedChange={(checked) => {
                              const newDays = checked
                                ? [...formData.prayerGroup.days, day]
                                : formData.prayerGroup.days.filter((d) => d !== day)
                              const newData = {
                                ...formData,
                                prayerGroup: { ...formData.prayerGroup, days: newDays },
                              }
                              setFormData(newData)

                              sendMessage({
                                type: "field_update",
                                data: { field: "prayerGroup.days", value: newDays },
                                userId: user?.id,
                                timestamp: Date.now(),
                              })
                            }}
                          />
                          <Label htmlFor={day} className="text-sm">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Discipleship Report */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    Discipleship Report (Max 10 entries)
                    <div className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Sync</div>
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={addDiscipleshipEntry}
                    disabled={formData.discipleship.length >= 10}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.discipleship.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-white">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={entry.name}
                          onChange={(e) => {
                            const newDiscipleship = [...formData.discipleship]
                            newDiscipleship[index].name = e.target.value
                            const newData = { ...formData, discipleship: newDiscipleship }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `discipleship.${index}.name`, value: e.target.value },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Timeline</Label>
                        <Input
                          value={entry.timeline}
                          onChange={(e) => {
                            const newDiscipleship = [...formData.discipleship]
                            newDiscipleship[index].timeline = e.target.value
                            const newData = { ...formData, discipleship: newDiscipleship }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `discipleship.${index}.timeline`, value: e.target.value },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label>Subject Taught</Label>
                      <Input
                        value={entry.subject}
                        onChange={(e) => {
                          const newDiscipleship = [...formData.discipleship]
                          newDiscipleship[index].subject = e.target.value
                          const newData = { ...formData, discipleship: newDiscipleship }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: `discipleship.${index}.subject`, value: e.target.value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={entry.hasBible}
                          onCheckedChange={(checked) => {
                            const newDiscipleship = [...formData.discipleship]
                            newDiscipleship[index].hasBible = checked as boolean
                            const newData = { ...formData, discipleship: newDiscipleship }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `discipleship.${index}.hasBible`, value: checked },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                        <Label>Has Bible?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={entry.didWrite}
                          onCheckedChange={(checked) => {
                            const newDiscipleship = [...formData.discipleship]
                            newDiscipleship[index].didWrite = checked as boolean
                            const newData = { ...formData, discipleship: newDiscipleship }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `discipleship.${index}.didWrite`, value: checked },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                        <Label>Did Write?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={entry.discussedAttendance}
                          onCheckedChange={(checked) => {
                            const newDiscipleship = [...formData.discipleship]
                            newDiscipleship[index].discussedAttendance = checked as boolean
                            const newData = { ...formData, discipleship: newDiscipleship }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `discipleship.${index}.discussedAttendance`, value: checked },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                        <Label>Discussed Attendance?</Label>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const newDiscipleship = formData.discipleship.filter((_, i) => i !== index)
                        const newData = { ...formData, discipleship: newDiscipleship }
                        setFormData(newData)

                        sendMessage({
                          type: "field_update",
                          data: { field: "discipleship", action: "remove", index },
                          userId: user?.id,
                          timestamp: Date.now(),
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Evangelism */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    Evangelism (Max 100 entries)
                    <div className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Sync</div>
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={addEvangelismEntry}
                    disabled={formData.evangelism.length >= 100}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.evangelism.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-white">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={entry.name}
                          onChange={(e) => {
                            const newEvangelism = [...formData.evangelism]
                            newEvangelism[index].name = e.target.value
                            const newData = { ...formData, evangelism: newEvangelism }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `evangelism.${index}.name`, value: e.target.value },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={entry.phone}
                          onChange={(e) => {
                            const newEvangelism = [...formData.evangelism]
                            newEvangelism[index].phone = e.target.value
                            const newData = { ...formData, evangelism: newEvangelism }
                            setFormData(newData)

                            sendMessage({
                              type: "field_update",
                              data: { field: `evangelism.${index}.phone`, value: e.target.value },
                              userId: user?.id,
                              timestamp: Date.now(),
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label>Address</Label>
                      <Input
                        value={entry.address}
                        onChange={(e) => {
                          const newEvangelism = [...formData.evangelism]
                          newEvangelism[index].address = e.target.value
                          const newData = { ...formData, evangelism: newEvangelism }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: `evangelism.${index}.address`, value: e.target.value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Status</Label>
                      <Select
                        value={entry.status}
                        onValueChange={(value) => {
                          const newEvangelism = [...formData.evangelism]
                          newEvangelism[index].status = value
                          const newData = { ...formData, evangelism: newEvangelism }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: `evangelism.${index}.status`, value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saved_and_filled">Saved and Filled</SelectItem>
                          <SelectItem value="saved_only">Saved Only</SelectItem>
                          <SelectItem value="not_yet_saved_and_filled">Not Yet Saved and Filled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newEvangelism = formData.evangelism.filter((_, i) => i !== index)
                        const newData = { ...formData, evangelism: newEvangelism }
                        setFormData(newData)

                        sendMessage({
                          type: "field_update",
                          data: { field: "evangelism", action: "remove", index },
                          userId: user?.id,
                          timestamp: Date.now(),
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Healing */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    Healing (Max 100 entries)
                    <div className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Sync</div>
                  </CardTitle>
                  <Button type="button" onClick={addHealingEntry} disabled={formData.healing.length >= 100} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.healing.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-white">
                    <div className="mb-4">
                      <Label>Name</Label>
                      <Input
                        value={entry.name}
                        onChange={(e) => {
                          const newHealing = [...formData.healing]
                          newHealing[index].name = e.target.value
                          const newData = { ...formData, healing: newHealing }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: `healing.${index}.name`, value: e.target.value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Healing Testimony</Label>
                      <Textarea
                        value={entry.comment}
                        onChange={(e) => {
                          const newHealing = [...formData.healing]
                          newHealing[index].comment = e.target.value
                          const newData = { ...formData, healing: newHealing }
                          setFormData(newData)

                          sendMessage({
                            type: "field_update",
                            data: { field: `healing.${index}.comment`, value: e.target.value },
                            userId: user?.id,
                            timestamp: Date.now(),
                          })
                        }}
                        placeholder="e.g., Healed from..."
                        rows={3}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newHealing = formData.healing.filter((_, i) => i !== index)
                        const newData = { ...formData, healing: newHealing }
                        setFormData(newData)

                        sendMessage({
                          type: "field_update",
                          data: { field: "healing", action: "remove", index },
                          userId: user?.id,
                          timestamp: Date.now(),
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                Submit Real-Time Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
